"""
Script para popular o banco de dados com dados de teste
Execute com: python manage.py shell < populate_test_data.py
"""

from datetime import date, time, timedelta
from core.models import (
    Usuario, Obra, Equipamento, Contrato, CriterioMedicao,
    CategoriaAtividade, Atividade, RegistroEquipamento,
    RegistroMaoObra, AtividadeEquipe, DiarioObra
)

print("\n🚀 Iniciando população do banco de dados...\n")

# ========== OBRAS ==========
print("📍 Criando Obras...")
obra1, created = Obra.objects.get_or_create(
    codigo="OBR-001",
    defaults={
        'nome': 'Pavimentação Rodovia BR-101',
        'local': 'BR-101 - Trecho Sul',
        'km_inicial': 10.000,
        'km_final': 25.000,
        'data_inicio': date(2025, 1, 15),
        'data_prevista_fim': date(2025, 12, 31),
        'responsavel': Usuario.objects.filter(tipo_usuario='admin').first(),
        'status': 'em_andamento'
    }
)
if created:
    print(f"  ✅ Obra criada: {obra1.nome}")

obra2, created = Obra.objects.get_or_create(
    codigo="OBR-002",
    defaults={
        'nome': 'Recuperação Ponte Rio Grande',
        'local': 'KM 45 - BR-101',
        'km_inicial': 45.000,
        'km_final': 45.500,
        'data_inicio': date(2025, 3, 1),
        'data_prevista_fim': date(2025, 8, 30),
        'responsavel': Usuario.objects.filter(tipo_usuario='admin').first(),
        'status': 'planejamento'
    }
)
if created:
    print(f"  ✅ Obra criada: {obra2.nome}")

# ========== EQUIPAMENTOS ==========
print("\n🚜 Criando Equipamentos...")

equipamentos_data = [
    {
        'nome': 'Caminhão Basculante 001',
        'tipo': 'caminhao',
        'modelo': 'MB 1620',
        'placa': 'ABC-1234',
        'fabricante': 'Mercedes-Benz',
        'ano': 2020,
        'horimetro_atual': 1500.5,
        'status': 'ativo',
        'obra': obra1,
    },
    {
        'nome': 'Escavadeira Hidráulica 001',
        'tipo': 'escavadeira',
        'modelo': 'PC200',
        'placa': 'XYZ-5678',
        'fabricante': 'Komatsu',
        'ano': 2021,
        'horimetro_atual': 800.0,
        'status': 'ativo',
        'obra': obra1,
    },
    {
        'nome': 'Rolo Compactador 001',
        'tipo': 'rolo_compactador',
        'modelo': 'CS54B',
        'placa': 'DEF-9012',
        'fabricante': 'Caterpillar',
        'ano': 2019,
        'horimetro_atual': 2300.0,
        'status': 'ativo',
        'obra': obra1,
    },
    {
        'nome': 'Motoniveladora 001',
        'tipo': 'motoniveladora',
        'modelo': '120K',
        'placa': 'GHI-3456',
        'fabricante': 'Caterpillar',
        'ano': 2022,
        'horimetro_atual': 450.0,
        'status': 'ativo',
        'obra': obra1,
    },
]

for eq_data in equipamentos_data:
    eq, created = Equipamento.objects.get_or_create(
        placa=eq_data['placa'],
        defaults=eq_data
    )
    if created:
        print(f"  ✅ Equipamento criado: {eq.nome} - {eq.placa}")

# ========== CONTRATOS ==========
print("\n📄 Criando Contratos...")

contratos_data = [
    {
        'fornecedor': 'Construtora ABC Ltda',
        'cnpj': '12.345.678/0001-99',
        'tipo': 'materiais',
        'numero_contrato': 'CONT-2025-001',
        'valor_mensal': 50000.00,
        'data_inicio': date(2025, 1, 1),
        'data_fim': date(2025, 12, 31),
        'obra': obra1,
        'ativo': True
    },
    {
        'fornecedor': 'Transportadora XYZ S/A',
        'cnpj': '98.765.432/0001-11',
        'tipo': 'servicos',
        'numero_contrato': 'CONT-2025-002',
        'valor_mensal': 30000.00,
        'data_inicio': date(2025, 1, 15),
        'data_fim': date(2025, 12, 31),
        'obra': obra1,
        'ativo': True
    },
]

for cont_data in contratos_data:
    cont, created = Contrato.objects.get_or_create(
        numero_contrato=cont_data['numero_contrato'],
        defaults=cont_data
    )
    if created:
        print(f"  ✅ Contrato criado: {cont.numero_contrato} - {cont.fornecedor}")

# ========== CRITÉRIOS DE MEDIÇÃO ==========
print("\n📊 Criando Critérios de Medição...")

criterios_data = [
    {
        'nome': 'Desconto por atraso',
        'tipo': 'desconto',
        'percentual': 5.0,
        'condicao': 'Atraso superior a 5 dias na entrega',
        'aplicacao': 'Medição mensal',
        'obra': obra1,
        'ativo': True
    },
    {
        'nome': 'Bônus por produtividade',
        'tipo': 'acrescimo',
        'percentual': 10.0,
        'condicao': 'Produção acima de 120% da meta',
        'aplicacao': 'Medição mensal',
        'obra': obra1,
        'ativo': True
    },
]

for crit_data in criterios_data:
    crit, created = CriterioMedicao.objects.get_or_create(
        nome=crit_data['nome'],
        obra=crit_data['obra'],
        defaults=crit_data
    )
    if created:
        print(f"  ✅ Critério criado: {crit.nome} ({crit.get_tipo_display()})")

# ========== CATEGORIAS DE ATIVIDADES ==========
print("\n🏷️ Criando Categorias de Atividades...")

categorias = [
    {'nome': 'Terraplenagem', 'descricao': 'Serviços de movimentação de terra'},
    {'nome': 'Pavimentação', 'descricao': 'Serviços de pavimentação asfáltica'},
    {'nome': 'Drenagem', 'descricao': 'Sistemas de drenagem'},
    {'nome': 'Sinalização', 'descricao': 'Sinalização horizontal e vertical'},
]

for cat_data in categorias:
    cat, created = CategoriaAtividade.objects.get_or_create(
        nome=cat_data['nome'],
        defaults=cat_data
    )
    if created:
        print(f"  ✅ Categoria criada: {cat.nome}")

# ========== ATIVIDADES ==========
print("\n📝 Criando Atividades...")

terraplenagem = CategoriaAtividade.objects.get(nome='Terraplenagem')
pavimentacao = CategoriaAtividade.objects.get(nome='Pavimentação')

atividades_data = [
    {
        'codigo': 'TERR-001',
        'descricao': 'Escavação de vala',
        'unidade': 'm3',
        'categoria': terraplenagem,
        'preco_unitario': 150.00,
        'obra': obra1,
        'ativa': True
    },
    {
        'codigo': 'TERR-002',
        'descricao': 'Aterro compactado',
        'unidade': 'm3',
        'categoria': terraplenagem,
        'preco_unitario': 120.00,
        'obra': obra1,
        'ativa': True
    },
    {
        'codigo': 'PAV-001',
        'descricao': 'Aplicação de CBUQ',
        'unidade': 'm2',
        'categoria': pavimentacao,
        'preco_unitario': 85.00,
        'obra': obra1,
        'ativa': True
    },
    {
        'codigo': 'PAV-002',
        'descricao': 'Imprimação betuminosa',
        'unidade': 'm2',
        'categoria': pavimentacao,
        'preco_unitario': 12.50,
        'obra': obra1,
        'ativa': True
    },
]

for ativ_data in atividades_data:
    ativ, created = Atividade.objects.get_or_create(
        codigo=ativ_data['codigo'],
        defaults=ativ_data
    )
    if created:
        print(f"  ✅ Atividade criada: {ativ.codigo} - {ativ.descricao}")

# ========== REGISTROS DE EQUIPAMENTOS ==========
print("\n🚜 Criando Registros de Equipamentos...")

motorista = Usuario.objects.filter(tipo_usuario='motorista').first()
equipamento = Equipamento.objects.filter(tipo='caminhao').first()

if motorista and equipamento:
    reg_eq, created = RegistroEquipamento.objects.get_or_create(
        equipamento=equipamento,
        data=date.today(),
        defaults={
            'motorista': motorista,
            'horimetro_inicial': 1500.5,
            'horimetro_final': 1508.2,
            'hora_inicio': time(8, 0),
            'hora_fim': time(17, 0),
            'atividade_principal': 'Transporte de material',
            'local': 'KM 15+500',
            'observacoes': 'Tempo bom, sem intercorrências',
            'validado': False
        }
    )
    if created:
        print(f"  ✅ Registro de equipamento criado: {equipamento.nome} - {date.today()}")

# ========== REGISTROS DE MÃO DE OBRA ==========
print("\n👷 Criando Registros de Mão de Obra...")

apontador = Usuario.objects.filter(tipo_usuario='apontador').first()
funcionarios = Usuario.objects.filter(tipo_usuario__in=['encarregado', 'motorista'])[:4]

if apontador and obra1:
    reg_mo, created = RegistroMaoObra.objects.get_or_create(
        apontador=apontador,
        obra=obra1,
        data=date.today(),
        defaults={
            'total_funcionarios': 4,
            'hora_inicio': time(7, 0),
            'hora_fim': time(16, 0),
            'local': 'Trecho KM 10+000 a KM 12+000',
            'observacoes': 'Dia produtivo, tempo bom',
            'validado': False
        }
    )
    if created:
        reg_mo.funcionarios_presentes.set(funcionarios)
        print(f"  ✅ Registro de mão de obra criado: {date.today()} - {apontador.nome}")

# ========== ATIVIDADES DA EQUIPE ==========
print("\n👥 Criando Atividades da Equipe...")

encarregado = Usuario.objects.filter(tipo_usuario='encarregado').first()

if encarregado and obra1:
    ativ_eq, created = AtividadeEquipe.objects.get_or_create(
        encarregado=encarregado,
        obra=obra1,
        data=date.today() + timedelta(days=1),
        descricao='Compactação de solo',
        defaults={
            'hora_inicio': time(8, 0),
            'hora_fim': time(12, 0),
            'local': 'KM 15+200',
            'status': 'planejada',
            'observacoes': 'Atenção especial na densidade'
        }
    )
    if created:
        ativ_eq.funcionarios.set(funcionarios)
        print(f"  ✅ Atividade da equipe criada: {ativ_eq.descricao} - {ativ_eq.data}")

# ========== DIÁRIO DE OBRA ==========
print("\n📖 Criando Diário de Obra...")

if encarregado and obra1:
    diario, created = DiarioObra.objects.get_or_create(
        encarregado=encarregado,
        obra=obra1,
        data=date.today(),
        defaults={
            'total_funcionarios': 10,
            'funcionarios_presentes': 9,
            'atividades_concluidas': 3,
            'atividades_parciais': 1,
            'condicoes_climaticas': 'Ensolarado, temperatura 28°C',
            'observacoes': 'Bom andamento das obras. Material recebido conforme programado.'
        }
    )
    if created:
        print(f"  ✅ Diário de obra criado: {obra1.codigo} - {date.today()}")

print("\n✅ População do banco de dados concluída com sucesso!")
print("\n📊 Resumo:")
print(f"  - Obras: {Obra.objects.count()}")
print(f"  - Equipamentos: {Equipamento.objects.count()}")
print(f"  - Contratos: {Contrato.objects.count()}")
print(f"  - Critérios de Medição: {CriterioMedicao.objects.count()}")
print(f"  - Categorias de Atividades: {CategoriaAtividade.objects.count()}")
print(f"  - Atividades: {Atividade.objects.count()}")
print(f"  - Registros de Equipamentos: {RegistroEquipamento.objects.count()}")
print(f"  - Registros de Mão de Obra: {RegistroMaoObra.objects.count()}")
print(f"  - Atividades da Equipe: {AtividadeEquipe.objects.count()}")
print(f"  - Diários de Obra: {DiarioObra.objects.count()}")
print("\n🎉 Pronto para testar!\n")
