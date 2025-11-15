from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone

from .models import (
    Usuario, Obra, Equipamento, Contrato, CriterioMedicao,
    CategoriaAtividade, Atividade, RegistroEquipamento,
    RegistroMaoObra, ServicoExecutado, AtividadeEquipe, DiarioObra
)
from .serializers import (
    UsuarioSerializer, LoginSerializer, RegistroSerializer,
    ObraSerializer, EquipamentoSerializer, ContratoSerializer,
    CriterioMedicaoSerializer, CategoriaAtividadeSerializer,
    AtividadeSerializer, RegistroEquipamentoSerializer,
    RegistroMaoObraSerializer, ServicoExecutadoSerializer,
    AtividadeEquipeSerializer, DiarioObraSerializer
)
from .importers import get_importer, CSVImportError

User = get_user_model()


class RegistroView(APIView):
    """
    API para registro de novos usuários
    POST /api/auth/registro
    
    Body:
    {
        "email": "admin@example.com",  // obrigatório para admin
        "matricula": "001234",  // obrigatório para apontador/encarregado/motorista
        "nome": "Nome Completo",
        "cpf": "123.456.789-00",
        "telefone": "(11) 98765-4321",
        "tipo_usuario": "admin",  // admin, apontador, encarregado, motorista
        "funcao": "engenheiro",
        "cargo": "Engenheiro Civil",
        "password": "senha123",
        "password_confirm": "senha123"
    }
    """
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = RegistroSerializer(data=request.data)
        
        if serializer.is_valid():
            usuario = serializer.save()
            
            # Gera tokens JWT
            refresh = RefreshToken.for_user(usuario)
            
            return Response({
                'message': 'Usuário criado com sucesso',
                'user': UsuarioSerializer(usuario).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    API para login de usuários
    POST /api/auth/login
    
    Aceita dois tipos de login baseado no perfil:
    
    1. Admin (email):
    {
        "email": "admin@example.com",
        "password": "senha123"
    }
    
    2. Apontador/Encarregado/Motorista (matrícula):
    {
        "matricula": "001234",
        "password": "senha123"
    }
    """
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Gera tokens JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Login realizado com sucesso',
                'user': {
                    'id': user.id,
                    'nome': user.nome,
                    'email': user.email,
                    'matricula': user.matricula,
                    'tipo_usuario': user.tipo_usuario,
                    'funcao': user.funcao,
                    'cargo': user.cargo,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    API para logout de usuários
    POST /api/auth/logout
    
    Body:
    {
        "refresh": "refresh_token_aqui"
    }
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({
                'message': 'Logout realizado com sucesso'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': 'Token inválido'
            }, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    """
    API para obter dados do usuário logado
    GET /api/auth/me
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)


class UsuarioListCreateView(generics.ListCreateAPIView):
    """
    API para listar e criar usuários (apenas admin)
    GET/POST /api/usuarios
    """
    
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filtra usuários baseado no tipo (opcional)"""
        queryset = Usuario.objects.all()
        tipo = self.request.query_params.get('tipo', None)
        
        if tipo:
            queryset = queryset.filter(tipo_usuario=tipo)
        
        return queryset


class UsuarioDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API para detalhes, edição e exclusão de usuário
    GET/PUT/PATCH/DELETE /api/usuarios/<id>
    """
    
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]


class ObraListCreateView(generics.ListCreateAPIView):
    """
    API para listar e criar obras
    GET/POST /api/obras
    """
    
    queryset = Obra.objects.all()
    serializer_class = ObraSerializer
    permission_classes = [permissions.IsAuthenticated]


class ObraDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API para detalhes, edição e exclusão de obra
    GET/PUT/PATCH/DELETE /api/obras/<id>
    """
    
    queryset = Obra.objects.all()
    serializer_class = ObraSerializer
    permission_classes = [permissions.IsAuthenticated]


# ========== EQUIPAMENTOS ==========

class EquipamentoListCreateView(generics.ListCreateAPIView):
    """
    API para listar e criar equipamentos
    GET/POST /api/equipamentos
    """
    
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Equipamento.objects.all()
        
        # Filtros opcionais
        obra_id = self.request.query_params.get('obra', None)
        status_eq = self.request.query_params.get('status', None)
        tipo = self.request.query_params.get('tipo', None)
        
        if obra_id:
            queryset = queryset.filter(obra_id=obra_id)
        if status_eq:
            queryset = queryset.filter(status=status_eq)
        if tipo:
            queryset = queryset.filter(tipo=tipo)
        
        return queryset


class EquipamentoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API para detalhes, edição e exclusão de equipamento
    GET/PUT/PATCH/DELETE /api/equipamentos/<id>
    """
    
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer
    permission_classes = [permissions.IsAuthenticated]


# ========== CONTRATOS ==========

class ContratoListCreateView(generics.ListCreateAPIView):
    """
    API para listar e criar contratos
    GET/POST /api/contratos
    """
    
    queryset = Contrato.objects.all()
    serializer_class = ContratoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Contrato.objects.all()
        obra_id = self.request.query_params.get('obra', None)
        
        if obra_id:
            queryset = queryset.filter(obra_id=obra_id)
        
        return queryset


class ContratoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API para detalhes, edição e exclusão de contrato
    GET/PUT/PATCH/DELETE /api/contratos/<id>
    """
    
    queryset = Contrato.objects.all()
    serializer_class = ContratoSerializer
    permission_classes = [permissions.IsAuthenticated]


# ========== CRITÉRIOS DE MEDIÇÃO ==========

class CriterioMedicaoListCreateView(generics.ListCreateAPIView):
    """
    API para listar e criar critérios de medição
    GET/POST /api/criterios-medicao
    """
    
    queryset = CriterioMedicao.objects.all()
    serializer_class = CriterioMedicaoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = CriterioMedicao.objects.all()
        obra_id = self.request.query_params.get('obra', None)
        
        if obra_id:
            queryset = queryset.filter(obra_id=obra_id)
        
        return queryset


class CriterioMedicaoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API para detalhes, edição e exclusão de critério de medição
    GET/PUT/PATCH/DELETE /api/criterios-medicao/<id>
    """
    
    queryset = CriterioMedicao.objects.all()
    serializer_class = CriterioMedicaoSerializer
    permission_classes = [permissions.IsAuthenticated]


# ========== CATEGORIAS DE ATIVIDADES ==========

class CategoriaAtividadeListCreateView(generics.ListCreateAPIView):
    """
    API para listar e criar categorias de atividades
    GET/POST /api/categorias-atividades
    """
    
    queryset = CategoriaAtividade.objects.all()
    serializer_class = CategoriaAtividadeSerializer
    permission_classes = [permissions.IsAuthenticated]


class CategoriaAtividadeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API para detalhes, edição e exclusão de categoria de atividade
    GET/PUT/PATCH/DELETE /api/categorias-atividades/<id>
    """
    
    queryset = CategoriaAtividade.objects.all()
    serializer_class = CategoriaAtividadeSerializer
    permission_classes = [permissions.IsAuthenticated]


# ========== ATIVIDADES ==========

class AtividadeListCreateView(generics.ListCreateAPIView):
    """
    API para listar e criar atividades
    GET/POST /api/atividades
    """
    
    queryset = Atividade.objects.all()
    serializer_class = AtividadeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Atividade.objects.all()
        
        obra_id = self.request.query_params.get('obra', None)
        categoria_id = self.request.query_params.get('categoria', None)
        ativa = self.request.query_params.get('ativa', None)
        
        if obra_id:
            queryset = queryset.filter(obra_id=obra_id)
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id)
        if ativa is not None:
            queryset = queryset.filter(ativa=(ativa.lower() == 'true'))
        
        return queryset


class AtividadeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API para detalhes, edição e exclusão de atividade
    GET/PUT/PATCH/DELETE /api/atividades/<id>
    """
    
    queryset = Atividade.objects.all()
    serializer_class = AtividadeSerializer
    permission_classes = [permissions.IsAuthenticated]


# ========== REGISTROS DE EQUIPAMENTOS ==========

class RegistroEquipamentoListCreateView(generics.ListCreateAPIView):
    """
    API para listar e criar registros de equipamentos
    GET/POST /api/registros-equipamentos
    """
    
    queryset = RegistroEquipamento.objects.all()
    serializer_class = RegistroEquipamentoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = RegistroEquipamento.objects.all()
        
        equipamento_id = self.request.query_params.get('equipamento', None)
        motorista_id = self.request.query_params.get('motorista', None)
        data = self.request.query_params.get('data', None)
        validado = self.request.query_params.get('validado', None)
        
        if equipamento_id:
            queryset = queryset.filter(equipamento_id=equipamento_id)
        if motorista_id:
            queryset = queryset.filter(motorista_id=motorista_id)
        if data:
            queryset = queryset.filter(data=data)
        if validado is not None:
            queryset = queryset.filter(validado=(validado.lower() == 'true'))
        
        return queryset


class RegistroEquipamentoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API para detalhes, edição e exclusão de registro de equipamento
    GET/PUT/PATCH/DELETE /api/registros-equipamentos/<id>
    """
    
    queryset = RegistroEquipamento.objects.all()
    serializer_class = RegistroEquipamentoSerializer
    permission_classes = [permissions.IsAuthenticated]


class ValidarRegistroEquipamentoView(APIView):
    """
    API para validar um registro de equipamento
    POST /api/registros-equipamentos/<id>/validar
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            registro = RegistroEquipamento.objects.get(pk=pk)
            
            # Verifica se o usuário pode validar (encarregado ou admin)
            if not (request.user.is_encarregado or request.user.is_admin):
                return Response({
                    'error': 'Apenas encarregados e admins podem validar registros'
                }, status=status.HTTP_403_FORBIDDEN)
            
            registro.validado = True
            registro.validado_por = request.user
            registro.data_validacao = timezone.now()
            registro.save()
            
            serializer = RegistroEquipamentoSerializer(registro)
            return Response(serializer.data)
            
        except RegistroEquipamento.DoesNotExist:
            return Response({
                'error': 'Registro não encontrado'
            }, status=status.HTTP_404_NOT_FOUND)


# ========== REGISTROS DE MÃO DE OBRA ==========

class RegistroMaoObraListCreateView(generics.ListCreateAPIView):
    """
    API para listar e criar registros de mão de obra
    GET/POST /api/registros-mao-obra
    """
    
    queryset = RegistroMaoObra.objects.all()
    serializer_class = RegistroMaoObraSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = RegistroMaoObra.objects.all()
        
        obra_id = self.request.query_params.get('obra', None)
        apontador_id = self.request.query_params.get('apontador', None)
        data = self.request.query_params.get('data', None)
        validado = self.request.query_params.get('validado', None)
        
        if obra_id:
            queryset = queryset.filter(obra_id=obra_id)
        if apontador_id:
            queryset = queryset.filter(apontador_id=apontador_id)
        if data:
            queryset = queryset.filter(data=data)
        if validado is not None:
            queryset = queryset.filter(validado=(validado.lower() == 'true'))
        
        return queryset


class RegistroMaoObraDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API para detalhes, edição e exclusão de registro de mão de obra
    GET/PUT/PATCH/DELETE /api/registros-mao-obra/<id>
    """
    
    queryset = RegistroMaoObra.objects.all()
    serializer_class = RegistroMaoObraSerializer
    permission_classes = [permissions.IsAuthenticated]


class ValidarRegistroMaoObraView(APIView):
    """
    API para validar um registro de mão de obra
    POST /api/registros-mao-obra/<id>/validar
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            registro = RegistroMaoObra.objects.get(pk=pk)
            
            # Verifica se o usuário pode validar (encarregado ou admin)
            if not (request.user.is_encarregado or request.user.is_admin):
                return Response({
                    'error': 'Apenas encarregados e admins podem validar registros'
                }, status=status.HTTP_403_FORBIDDEN)
            
            registro.validado = True
            registro.validado_por = request.user
            registro.save()
            
            serializer = RegistroMaoObraSerializer(registro)
            return Response(serializer.data)
            
        except RegistroMaoObra.DoesNotExist:
            return Response({
                'error': 'Registro não encontrado'
            }, status=status.HTTP_404_NOT_FOUND)


# ========== ATIVIDADES DA EQUIPE ==========

class AtividadeEquipeListCreateView(generics.ListCreateAPIView):
    """
    API para listar e criar atividades da equipe
    GET/POST /api/atividades-equipe
    """
    
    queryset = AtividadeEquipe.objects.all()
    serializer_class = AtividadeEquipeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = AtividadeEquipe.objects.all()
        
        obra_id = self.request.query_params.get('obra', None)
        encarregado_id = self.request.query_params.get('encarregado', None)
        data = self.request.query_params.get('data', None)
        status_ativ = self.request.query_params.get('status', None)
        
        if obra_id:
            queryset = queryset.filter(obra_id=obra_id)
        if encarregado_id:
            queryset = queryset.filter(encarregado_id=encarregado_id)
        if data:
            queryset = queryset.filter(data=data)
        if status_ativ:
            queryset = queryset.filter(status=status_ativ)
        
        return queryset


class AtividadeEquipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API para detalhes, edição e exclusão de atividade da equipe
    GET/PUT/PATCH/DELETE /api/atividades-equipe/<id>
    """
    
    queryset = AtividadeEquipe.objects.all()
    serializer_class = AtividadeEquipeSerializer
    permission_classes = [permissions.IsAuthenticated]


# ========== DIÁRIOS DE OBRA ==========

class DiarioObraListCreateView(generics.ListCreateAPIView):
    """
    API para listar e criar diários de obra (RDO)
    GET/POST /api/diarios-obra
    """
    
    queryset = DiarioObra.objects.all()
    serializer_class = DiarioObraSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = DiarioObra.objects.all()
        
        obra_id = self.request.query_params.get('obra', None)
        encarregado_id = self.request.query_params.get('encarregado', None)
        data = self.request.query_params.get('data', None)
        
        if obra_id:
            queryset = queryset.filter(obra_id=obra_id)
        if encarregado_id:
            queryset = queryset.filter(encarregado_id=encarregado_id)
        if data:
            queryset = queryset.filter(data=data)
        
        return queryset


class DiarioObraDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API para detalhes, edição e exclusão de diário de obra
    GET/PUT/PATCH/DELETE /api/diarios-obra/<id>
    """
    
    queryset = DiarioObra.objects.all()
    serializer_class = DiarioObraSerializer
    permission_classes = [permissions.IsAuthenticated]


# ========== ESTATÍSTICAS/DASHBOARD ==========

class DashboardStatsView(APIView):
    """
    API para estatísticas do dashboard
    GET /api/dashboard/stats
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Estatísticas baseadas no tipo de usuário
        stats = {}
        
        if user.is_admin:
            stats = {
                'total_obras': Obra.objects.count(),
                'obras_ativas': Obra.objects.filter(status='em_andamento').count(),
                'total_equipamentos': Equipamento.objects.count(),
                'equipamentos_ativos': Equipamento.objects.filter(status='ativo').count(),
                'total_usuarios': Usuario.objects.count(),
                'total_contratos': Contrato.objects.filter(ativo=True).count(),
            }
        
        elif user.is_apontador:
            stats = {
                'registros_hoje': RegistroMaoObra.objects.filter(
                    apontador=user,
                    data=timezone.now().date()
                ).count(),
                'registros_pendentes': RegistroMaoObra.objects.filter(
                    apontador=user,
                    validado=False
                ).count(),
                'total_registros': RegistroMaoObra.objects.filter(apontador=user).count(),
            }
        
        elif user.is_encarregado:
            stats = {
                'atividades_hoje': AtividadeEquipe.objects.filter(
                    encarregado=user,
                    data=timezone.now().date()
                ).count(),
                'atividades_pendentes': AtividadeEquipe.objects.filter(
                    encarregado=user,
                    status='planejada'
                ).count(),
                'diarios_criados': DiarioObra.objects.filter(encarregado=user).count(),
                'registros_validar': RegistroMaoObra.objects.filter(
                    validado=False
                ).count(),
            }
        
        elif user.is_motorista:
            stats = {
                'registros_hoje': RegistroEquipamento.objects.filter(
                    motorista=user,
                    data=timezone.now().date()
                ).count(),
                'registros_pendentes': RegistroEquipamento.objects.filter(
                    motorista=user,
                    validado=False
                ).count(),
                'total_registros': RegistroEquipamento.objects.filter(motorista=user).count(),
                'equipamento_atual': user.equipamentos_operando.first().nome if user.equipamentos_operando.first() else None,
            }
        
        return Response(stats)


# ========== IMPORTAÇÃO DE CSV ==========

class ImportarCSVView(APIView):
    """
    API para importar dados de planilhas CSV
    POST /api/importar-csv
    
    Form-data:
    - tipo: obras, equipamentos, usuarios, atividades, registros_equipamentos, registros_mao_obra, diarios_obra
    - arquivo: arquivo CSV
    """
    
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        # Verifica se é admin ou encarregado
        if not (request.user.is_admin or request.user.is_encarregado):
            return Response({
                'error': 'Apenas admins e encarregados podem importar dados'
            }, status=status.HTTP_403_FORBIDDEN)
        
        tipo = request.data.get('tipo')
        arquivo = request.FILES.get('arquivo')
        
        if not tipo:
            return Response({
                'error': 'Tipo de importação não fornecido'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not arquivo:
            return Response({
                'error': 'Arquivo não fornecido'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verifica extensão do arquivo
        if not arquivo.name.endswith('.csv'):
            return Response({
                'error': 'Arquivo deve ser CSV'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Obtém o importador correto
            ImporterClass = get_importer(tipo)
            importer = ImporterClass(arquivo)
            
            # Executa importação
            result = importer.import_data()
            
            return Response({
                'message': f'Importação concluída',
                'tipo': tipo,
                'resultado': result
            }, status=status.HTTP_200_OK)
            
        except CSVImportError as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': f'Erro ao importar dados: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DownloadModeloCSVView(APIView):
    """
    API para baixar modelos de CSV
    GET /api/modelo-csv/{tipo}
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    MODELOS = {
        'obras': [
            'codigo,nome,local,km_inicial,km_final,data_inicio,data_prevista_fim,responsavel_email,status',
            'OBR-001,Pavimentação BR-101,BR-101 Trecho Sul,10.000,25.000,01/01/2025,31/12/2025,admin@tcc.com,em_andamento',
        ],
        'equipamentos': [
            'nome,tipo,modelo,placa,fabricante,ano,horimetro_atual,status,obra_codigo,motorista_matricula',
            'Caminhão Basculante 001,caminhao,MB 1620,ABC-1234,Mercedes-Benz,2020,1500.5,ativo,OBR-001,001236',
        ],
        'usuarios': [
            'nome,email,matricula,cpf,telefone,tipo_usuario,funcao,cargo,password',
            'João Silva,,001237,123.456.789-00,(11) 98765-4321,motorista,motorista,Motorista,senha123',
        ],
        'atividades': [
            'codigo,descricao,unidade,categoria_nome,preco_unitario,obra_codigo,ativa',
            'SERV-001,Escavação de vala,m3,Terraplenagem,150.00,OBR-001,true',
        ],
        'registros_equipamentos': [
            'equipamento_placa,motorista_matricula,data,horimetro_inicial,horimetro_final,hora_inicio,hora_fim,atividade_principal,local,observacoes',
            'ABC-1234,001236,15/11/2025,1500.5,1508.2,08:00,17:00,Transporte de material,KM 15+500,Tempo bom',
        ],
        'registros_mao_obra': [
            'apontador_matricula,obra_codigo,data,total_funcionarios,hora_inicio,hora_fim,local,observacoes,funcionarios_matriculas',
            '001234,OBR-001,15/11/2025,4,07:00,16:00,KM 10+000 a KM 12+000,Dia produtivo,001235;001236',
        ],
        'diarios_obra': [
            'encarregado_matricula,obra_codigo,data,total_funcionarios,funcionarios_presentes,atividades_concluidas,atividades_parciais,condicoes_climaticas,observacoes',
            '001235,OBR-001,15/11/2025,10,9,3,1,Ensolarado 28°C,Bom andamento das obras',
        ],
    }
    
    def get(self, request, tipo):
        if tipo not in self.MODELOS:
            return Response({
                'error': 'Tipo de modelo inválido',
                'tipos_disponiveis': list(self.MODELOS.keys())
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Gera CSV
        linhas = self.MODELOS[tipo]
        csv_content = '\n'.join(linhas)
        
        from django.http import HttpResponse
        response = HttpResponse(csv_content, content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="modelo_{tipo}.csv"'
        
        # Adiciona BOM UTF-8 para Excel
        response.write('\ufeff')
        
        return response


class ExportarCSVView(APIView):
    """
    API para exportar dados para CSV
    GET /api/exportar-csv/{tipo}
    
    Query params opcionais:
    - obra: ID da obra para filtrar
    - data_inicio: Data de início (formato: YYYY-MM-DD)
    - data_fim: Data de fim (formato: YYYY-MM-DD)
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, tipo):
        import csv
        from django.http import HttpResponse
        from datetime import datetime
        
        # Filtros
        obra_id = request.query_params.get('obra')
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')
        
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="export_{tipo}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        
        # Adiciona BOM UTF-8 para Excel
        response.write('\ufeff')
        
        writer = csv.writer(response)
        
        if tipo == 'obras':
            writer.writerow(['Código', 'Nome', 'Local', 'KM Inicial', 'KM Final', 'Data Início', 'Data Fim', 'Responsável', 'Status'])
            
            obras = Obra.objects.all()
            if obra_id:
                obras = obras.filter(id=obra_id)
            
            for obra in obras:
                writer.writerow([
                    obra.codigo,
                    obra.nome,
                    obra.local,
                    obra.km_inicial,
                    obra.km_final,
                    obra.data_inicio.strftime('%d/%m/%Y'),
                    obra.data_prevista_fim.strftime('%d/%m/%Y'),
                    obra.responsavel.nome if obra.responsavel else '',
                    obra.status
                ])
        
        elif tipo == 'equipamentos':
            writer.writerow(['Nome', 'Tipo', 'Modelo', 'Placa', 'Fabricante', 'Ano', 'Horímetro', 'Status', 'Obra'])
            
            equipamentos = Equipamento.objects.all()
            if obra_id:
                equipamentos = equipamentos.filter(obra_id=obra_id)
            
            for eq in equipamentos:
                writer.writerow([
                    eq.nome,
                    eq.tipo,
                    eq.modelo,
                    eq.placa,
                    eq.fabricante,
                    eq.ano,
                    eq.horimetro_atual,
                    eq.status,
                    eq.obra.nome if eq.obra else ''
                ])
        
        elif tipo == 'registros_equipamentos':
            writer.writerow(['Data', 'Equipamento', 'Motorista', 'Horímetro Inicial', 'Horímetro Final', 'Horas Trabalhadas', 'Atividade', 'Local', 'Validado'])
            
            registros = RegistroEquipamento.objects.select_related('equipamento', 'motorista').all()
            
            if obra_id:
                registros = registros.filter(equipamento__obra_id=obra_id)
            if data_inicio:
                registros = registros.filter(data__gte=datetime.strptime(data_inicio, '%Y-%m-%d').date())
            if data_fim:
                registros = registros.filter(data__lte=datetime.strptime(data_fim, '%Y-%m-%d').date())
            
            for reg in registros:
                writer.writerow([
                    reg.data.strftime('%d/%m/%Y'),
                    reg.equipamento.nome,
                    reg.motorista.nome,
                    reg.horimetro_inicial,
                    reg.horimetro_final,
                    reg.horas_trabalhadas,
                    reg.atividade_principal,
                    reg.local,
                    'Sim' if reg.validado else 'Não'
                ])
        
        elif tipo == 'registros_mao_obra':
            writer.writerow(['Data', 'Obra', 'Apontador', 'Total Funcionários', 'Hora Início', 'Hora Fim', 'Local', 'Validado'])
            
            registros = RegistroMaoObra.objects.select_related('obra', 'apontador').all()
            
            if obra_id:
                registros = registros.filter(obra_id=obra_id)
            if data_inicio:
                registros = registros.filter(data__gte=datetime.strptime(data_inicio, '%Y-%m-%d').date())
            if data_fim:
                registros = registros.filter(data__lte=datetime.strptime(data_fim, '%Y-%m-%d').date())
            
            for reg in registros:
                writer.writerow([
                    reg.data.strftime('%d/%m/%Y'),
                    reg.obra.nome,
                    reg.apontador.nome,
                    reg.total_funcionarios,
                    reg.hora_inicio.strftime('%H:%M'),
                    reg.hora_fim.strftime('%H:%M'),
                    reg.local,
                    'Sim' if reg.validado else 'Não'
                ])
        
        elif tipo == 'diarios_obra':
            writer.writerow(['Data', 'Obra', 'Encarregado', 'Total Func.', 'Presentes', 'Ativ. Concluídas', 'Condições', 'Observações'])
            
            diarios = DiarioObra.objects.select_related('obra', 'encarregado').all()
            
            if obra_id:
                diarios = diarios.filter(obra_id=obra_id)
            if data_inicio:
                diarios = diarios.filter(data__gte=datetime.strptime(data_inicio, '%Y-%m-%d').date())
            if data_fim:
                diarios = diarios.filter(data__lte=datetime.strptime(data_fim, '%Y-%m-%d').date())
            
            for diario in diarios:
                writer.writerow([
                    diario.data.strftime('%d/%m/%Y'),
                    diario.obra.nome,
                    diario.encarregado.nome,
                    diario.total_funcionarios,
                    diario.funcionarios_presentes,
                    diario.atividades_concluidas,
                    diario.condicoes_climaticas,
                    diario.observacoes
                ])
        
        else:
            return Response({
                'error': 'Tipo de exportação inválido'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return response
