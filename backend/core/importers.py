"""
Módulo para importação de dados via CSV
"""
import csv
import io
from datetime import datetime
from decimal import Decimal
from typing import List, Dict, Any
from django.db import transaction
from django.core.exceptions import ValidationError

from .models import (
    Usuario, Obra, Equipamento, Contrato, CriterioMedicao,
    CategoriaAtividade, Atividade, RegistroEquipamento,
    RegistroMaoObra, AtividadeEquipe, DiarioObra
)


class CSVImportError(Exception):
    """Erro customizado para importação de CSV"""
    pass


class BaseCSVImporter:
    """Classe base para importadores CSV"""
    
    required_fields: List[str] = []
    model = None
    
    def __init__(self, csv_file):
        self.csv_file = csv_file
        self.errors = []
        self.success_count = 0
        self.skip_count = 0
    
    def parse_csv(self) -> List[Dict[str, Any]]:
        """Parse do arquivo CSV"""
        try:
            # Tenta detectar encoding
            content = self.csv_file.read()
            
            # Tenta UTF-8 primeiro
            try:
                decoded = content.decode('utf-8')
            except UnicodeDecodeError:
                # Fallback para latin-1
                decoded = content.decode('latin-1')
            
            # Cria StringIO para o csv.DictReader
            csv_io = io.StringIO(decoded)
            reader = csv.DictReader(csv_io)
            
            return list(reader)
        except Exception as e:
            raise CSVImportError(f"Erro ao ler arquivo CSV: {str(e)}")
    
    def validate_row(self, row: Dict[str, Any], row_number: int) -> bool:
        """Valida uma linha do CSV"""
        for field in self.required_fields:
            if field not in row or not row[field].strip():
                self.errors.append({
                    'row': row_number,
                    'error': f'Campo obrigatório ausente: {field}'
                })
                return False
        return True
    
    def process_row(self, row: Dict[str, Any]) -> Any:
        """Processa uma linha do CSV - deve ser implementado nas subclasses"""
        raise NotImplementedError
    
    def import_data(self) -> Dict[str, Any]:
        """Importa dados do CSV"""
        rows = self.parse_csv()
        
        for idx, row in enumerate(rows, start=2):  # Linha 2 (1 é o header)
            if not self.validate_row(row, idx):
                self.skip_count += 1
                continue
            
            try:
                with transaction.atomic():
                    self.process_row(row)
                    self.success_count += 1
            except Exception as e:
                self.errors.append({
                    'row': idx,
                    'error': str(e)
                })
                self.skip_count += 1
        
        return {
            'success': self.success_count,
            'errors': len(self.errors),
            'skipped': self.skip_count,
            'total': len(rows),
            'error_details': self.errors
        }


class ObraCSVImporter(BaseCSVImporter):
    """
    Importador de Obras
    
    Formato esperado do CSV:
    codigo,nome,local,km_inicial,km_final,data_inicio,data_prevista_fim,responsavel_email,status
    """
    
    required_fields = ['codigo', 'nome', 'local', 'km_inicial', 'km_final', 'data_inicio', 'data_prevista_fim']
    model = Obra
    
    def process_row(self, row: Dict[str, Any]) -> Obra:
        # Busca responsável se fornecido
        responsavel = None
        if row.get('responsavel_email'):
            try:
                responsavel = Usuario.objects.get(email=row['responsavel_email'])
            except Usuario.DoesNotExist:
                pass
        
        # Verifica se já existe
        obra, created = Obra.objects.update_or_create(
            codigo=row['codigo'],
            defaults={
                'nome': row['nome'],
                'local': row['local'],
                'km_inicial': Decimal(row['km_inicial'].replace(',', '.')),
                'km_final': Decimal(row['km_final'].replace(',', '.')),
                'data_inicio': datetime.strptime(row['data_inicio'], '%d/%m/%Y').date(),
                'data_prevista_fim': datetime.strptime(row['data_prevista_fim'], '%d/%m/%Y').date(),
                'responsavel': responsavel,
                'status': row.get('status', 'planejamento')
            }
        )
        return obra


class EquipamentoCSVImporter(BaseCSVImporter):
    """
    Importador de Equipamentos
    
    Formato esperado do CSV:
    nome,tipo,modelo,placa,fabricante,ano,horimetro_atual,status,obra_codigo,motorista_matricula
    """
    
    required_fields = ['nome', 'tipo', 'modelo', 'placa', 'fabricante', 'ano']
    model = Equipamento
    
    def process_row(self, row: Dict[str, Any]) -> Equipamento:
        # Busca obra se fornecido
        obra = None
        if row.get('obra_codigo'):
            try:
                obra = Obra.objects.get(codigo=row['obra_codigo'])
            except Obra.DoesNotExist:
                pass
        
        # Busca motorista se fornecido
        motorista = None
        if row.get('motorista_matricula'):
            try:
                motorista = Usuario.objects.get(
                    matricula=row['motorista_matricula'],
                    tipo_usuario='motorista'
                )
            except Usuario.DoesNotExist:
                pass
        
        equipamento, created = Equipamento.objects.update_or_create(
            placa=row['placa'],
            defaults={
                'nome': row['nome'],
                'tipo': row['tipo'],
                'modelo': row['modelo'],
                'fabricante': row['fabricante'],
                'ano': int(row['ano']),
                'horimetro_atual': Decimal(row.get('horimetro_atual', '0').replace(',', '.')),
                'status': row.get('status', 'ativo'),
                'obra': obra,
                'motorista_atual': motorista
            }
        )
        return equipamento


class UsuarioCSVImporter(BaseCSVImporter):
    """
    Importador de Usuários
    
    Formato esperado do CSV:
    nome,email,matricula,cpf,telefone,tipo_usuario,funcao,cargo,password
    """
    
    required_fields = ['nome', 'tipo_usuario', 'funcao']
    model = Usuario
    
    def process_row(self, row: Dict[str, Any]) -> Usuario:
        # Verifica se é admin (precisa email) ou outro (precisa matrícula)
        tipo = row['tipo_usuario']
        
        if tipo == 'admin':
            if not row.get('email'):
                raise ValidationError('Admin precisa de email')
            lookup = {'email': row['email']}
        else:
            if not row.get('matricula'):
                raise ValidationError(f'{tipo} precisa de matrícula')
            lookup = {'matricula': row['matricula']}
        
        usuario, created = Usuario.objects.update_or_create(
            **lookup,
            defaults={
                'nome': row['nome'],
                'email': row.get('email', '') or None,
                'matricula': row.get('matricula', '') or None,
                'cpf': row.get('cpf', ''),
                'telefone': row.get('telefone', ''),
                'tipo_usuario': tipo,
                'funcao': row['funcao'],
                'cargo': row.get('cargo', ''),
            }
        )
        
        # Define senha se fornecida e usuário novo
        if created and row.get('password'):
            usuario.set_password(row['password'])
            usuario.save()
        
        return usuario


class AtividadeCSVImporter(BaseCSVImporter):
    """
    Importador de Atividades
    
    Formato esperado do CSV:
    codigo,descricao,unidade,categoria_nome,preco_unitario,obra_codigo,ativa
    """
    
    required_fields = ['codigo', 'descricao', 'unidade', 'preco_unitario', 'obra_codigo']
    model = Atividade
    
    def process_row(self, row: Dict[str, Any]) -> Atividade:
        # Busca ou cria categoria
        categoria = None
        if row.get('categoria_nome'):
            categoria, _ = CategoriaAtividade.objects.get_or_create(
                nome=row['categoria_nome']
            )
        
        # Busca obra
        try:
            obra = Obra.objects.get(codigo=row['obra_codigo'])
        except Obra.DoesNotExist:
            raise ValidationError(f"Obra {row['obra_codigo']} não encontrada")
        
        atividade, created = Atividade.objects.update_or_create(
            codigo=row['codigo'],
            defaults={
                'descricao': row['descricao'],
                'unidade': row['unidade'],
                'categoria': categoria,
                'preco_unitario': Decimal(row['preco_unitario'].replace(',', '.')),
                'obra': obra,
                'ativa': row.get('ativa', 'true').lower() == 'true'
            }
        )
        return atividade


class RegistroEquipamentoCSVImporter(BaseCSVImporter):
    """
    Importador de Registros de Equipamentos
    
    Formato esperado do CSV:
    equipamento_placa,motorista_matricula,data,horimetro_inicial,horimetro_final,hora_inicio,hora_fim,atividade_principal,local,observacoes
    """
    
    required_fields = [
        'equipamento_placa', 'motorista_matricula', 'data',
        'horimetro_inicial', 'horimetro_final', 'hora_inicio', 'hora_fim',
        'atividade_principal', 'local'
    ]
    model = RegistroEquipamento
    
    def process_row(self, row: Dict[str, Any]) -> RegistroEquipamento:
        # Busca equipamento
        try:
            equipamento = Equipamento.objects.get(placa=row['equipamento_placa'])
        except Equipamento.DoesNotExist:
            raise ValidationError(f"Equipamento {row['equipamento_placa']} não encontrado")
        
        # Busca motorista
        try:
            motorista = Usuario.objects.get(
                matricula=row['motorista_matricula'],
                tipo_usuario='motorista'
            )
        except Usuario.DoesNotExist:
            raise ValidationError(f"Motorista {row['motorista_matricula']} não encontrado")
        
        data = datetime.strptime(row['data'], '%d/%m/%Y').date()
        
        registro, created = RegistroEquipamento.objects.update_or_create(
            equipamento=equipamento,
            data=data,
            defaults={
                'motorista': motorista,
                'horimetro_inicial': Decimal(row['horimetro_inicial'].replace(',', '.')),
                'horimetro_final': Decimal(row['horimetro_final'].replace(',', '.')),
                'hora_inicio': datetime.strptime(row['hora_inicio'], '%H:%M').time(),
                'hora_fim': datetime.strptime(row['hora_fim'], '%H:%M').time(),
                'atividade_principal': row['atividade_principal'],
                'local': row['local'],
                'observacoes': row.get('observacoes', '')
            }
        )
        return registro


class RegistroMaoObraCSVImporter(BaseCSVImporter):
    """
    Importador de Registros de Mão de Obra
    
    Formato esperado do CSV:
    apontador_matricula,obra_codigo,data,total_funcionarios,hora_inicio,hora_fim,local,observacoes,funcionarios_matriculas
    
    funcionarios_matriculas: separados por ';' ex: "001234;001235;001236"
    """
    
    required_fields = [
        'apontador_matricula', 'obra_codigo', 'data',
        'total_funcionarios', 'hora_inicio', 'hora_fim', 'local'
    ]
    model = RegistroMaoObra
    
    def process_row(self, row: Dict[str, Any]) -> RegistroMaoObra:
        # Busca apontador
        try:
            apontador = Usuario.objects.get(
                matricula=row['apontador_matricula'],
                tipo_usuario='apontador'
            )
        except Usuario.DoesNotExist:
            raise ValidationError(f"Apontador {row['apontador_matricula']} não encontrado")
        
        # Busca obra
        try:
            obra = Obra.objects.get(codigo=row['obra_codigo'])
        except Obra.DoesNotExist:
            raise ValidationError(f"Obra {row['obra_codigo']} não encontrada")
        
        data = datetime.strptime(row['data'], '%d/%m/%Y').date()
        
        registro, created = RegistroMaoObra.objects.update_or_create(
            apontador=apontador,
            obra=obra,
            data=data,
            defaults={
                'total_funcionarios': int(row['total_funcionarios']),
                'hora_inicio': datetime.strptime(row['hora_inicio'], '%H:%M').time(),
                'hora_fim': datetime.strptime(row['hora_fim'], '%H:%M').time(),
                'local': row['local'],
                'observacoes': row.get('observacoes', '')
            }
        )
        
        # Adiciona funcionários presentes
        if row.get('funcionarios_matriculas'):
            matriculas = row['funcionarios_matriculas'].split(';')
            funcionarios = Usuario.objects.filter(matricula__in=matriculas)
            registro.funcionarios_presentes.set(funcionarios)
        
        return registro


class DiarioObraCSVImporter(BaseCSVImporter):
    """
    Importador de Diários de Obra
    
    Formato esperado do CSV:
    encarregado_matricula,obra_codigo,data,total_funcionarios,funcionarios_presentes,atividades_concluidas,atividades_parciais,condicoes_climaticas,observacoes
    """
    
    required_fields = [
        'encarregado_matricula', 'obra_codigo', 'data',
        'total_funcionarios', 'funcionarios_presentes',
        'condicoes_climaticas', 'observacoes'
    ]
    model = DiarioObra
    
    def process_row(self, row: Dict[str, Any]) -> DiarioObra:
        # Busca encarregado
        try:
            encarregado = Usuario.objects.get(
                matricula=row['encarregado_matricula'],
                tipo_usuario='encarregado'
            )
        except Usuario.DoesNotExist:
            raise ValidationError(f"Encarregado {row['encarregado_matricula']} não encontrado")
        
        # Busca obra
        try:
            obra = Obra.objects.get(codigo=row['obra_codigo'])
        except Obra.DoesNotExist:
            raise ValidationError(f"Obra {row['obra_codigo']} não encontrada")
        
        data = datetime.strptime(row['data'], '%d/%m/%Y').date()
        
        diario, created = DiarioObra.objects.update_or_create(
            encarregado=encarregado,
            obra=obra,
            data=data,
            defaults={
                'total_funcionarios': int(row['total_funcionarios']),
                'funcionarios_presentes': int(row['funcionarios_presentes']),
                'atividades_concluidas': int(row.get('atividades_concluidas', 0)),
                'atividades_parciais': int(row.get('atividades_parciais', 0)),
                'condicoes_climaticas': row['condicoes_climaticas'],
                'observacoes': row['observacoes']
            }
        )
        return diario


# Mapeamento de tipos para importadores
IMPORTERS = {
    'obras': ObraCSVImporter,
    'equipamentos': EquipamentoCSVImporter,
    'usuarios': UsuarioCSVImporter,
    'atividades': AtividadeCSVImporter,
    'registros_equipamentos': RegistroEquipamentoCSVImporter,
    'registros_mao_obra': RegistroMaoObraCSVImporter,
    'diarios_obra': DiarioObraCSVImporter,
}


def get_importer(tipo: str):
    """Retorna o importador para o tipo especificado"""
    if tipo not in IMPORTERS:
        raise ValueError(f"Tipo de importação inválido: {tipo}")
    return IMPORTERS[tipo]
