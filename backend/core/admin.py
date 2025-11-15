from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    Usuario, Obra, Equipamento, Contrato, CriterioMedicao,
    CategoriaAtividade, Atividade, RegistroEquipamento,
    RegistroMaoObra, ServicoExecutado, AtividadeEquipe, DiarioObra
)


@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin):
    """Configuração do admin para o modelo Usuario"""
    
    list_display = ['nome', 'email', 'matricula', 'tipo_usuario', 'funcao', 'is_active', 'created_at']
    list_filter = ['tipo_usuario', 'funcao', 'is_active', 'created_at']
    search_fields = ['nome', 'email', 'matricula', 'cpf']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Autenticação', {
            'fields': ('email', 'matricula', 'password')
        }),
        ('Dados Pessoais', {
            'fields': ('nome', 'cpf', 'telefone')
        }),
        ('Dados Profissionais', {
            'fields': ('tipo_usuario', 'funcao', 'cargo')
        }),
        ('Permissões', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        ('Criar Novo Usuário', {
            'classes': ('wide',),
            'fields': ('email', 'matricula', 'nome', 'tipo_usuario', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Obra)
class ObraAdmin(admin.ModelAdmin):
    """Configuração do admin para o modelo Obra"""
    
    list_display = ['codigo', 'nome', 'local', 'status', 'responsavel', 'data_inicio']
    list_filter = ['status', 'created_at']
    search_fields = ['nome', 'codigo', 'local']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('nome', 'codigo', 'local')
        }),
        ('Localização', {
            'fields': ('km_inicial', 'km_final')
        }),
        ('Datas', {
            'fields': ('data_inicio', 'data_prevista_fim')
        }),
        ('Gestão', {
            'fields': ('responsavel', 'status')
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Equipamento)
class EquipamentoAdmin(admin.ModelAdmin):
    """Admin para modelo Equipamento"""
    
    list_display = ['nome', 'tipo', 'placa', 'status', 'obra', 'motorista_atual']
    list_filter = ['tipo', 'status', 'obra']
    search_fields = ['nome', 'placa', 'modelo', 'fabricante']
    ordering = ['nome']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Contrato)
class ContratoAdmin(admin.ModelAdmin):
    """Admin para modelo Contrato"""
    
    list_display = ['numero_contrato', 'fornecedor', 'tipo', 'valor_mensal', 'obra', 'ativo']
    list_filter = ['tipo', 'ativo', 'obra']
    search_fields = ['numero_contrato', 'fornecedor', 'cnpj']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(CriterioMedicao)
class CriterioMedicaoAdmin(admin.ModelAdmin):
    """Admin para modelo CriterioMedicao"""
    
    list_display = ['nome', 'tipo', 'percentual', 'obra', 'ativo']
    list_filter = ['tipo', 'ativo', 'obra']
    search_fields = ['nome', 'aplicacao']
    ordering = ['nome']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(CategoriaAtividade)
class CategoriaAtividadeAdmin(admin.ModelAdmin):
    """Admin para modelo CategoriaAtividade"""
    
    list_display = ['nome', 'descricao']
    search_fields = ['nome']
    ordering = ['nome']


@admin.register(Atividade)
class AtividadeAdmin(admin.ModelAdmin):
    """Admin para modelo Atividade"""
    
    list_display = ['codigo', 'descricao', 'unidade', 'preco_unitario', 'obra', 'categoria', 'ativa']
    list_filter = ['unidade', 'obra', 'categoria', 'ativa']
    search_fields = ['codigo', 'descricao']
    ordering = ['codigo']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(RegistroEquipamento)
class RegistroEquipamentoAdmin(admin.ModelAdmin):
    """Admin para modelo RegistroEquipamento"""
    
    list_display = ['equipamento', 'motorista', 'data', 'horimetro_inicial', 'horimetro_final', 'validado']
    list_filter = ['validado', 'data', 'equipamento']
    search_fields = ['equipamento__nome', 'motorista__nome', 'local']
    ordering = ['-data', '-created_at']
    readonly_fields = ['created_at', 'updated_at', 'horas_trabalhadas', 'horimetro_trabalhado']


@admin.register(RegistroMaoObra)
class RegistroMaoObraAdmin(admin.ModelAdmin):
    """Admin para modelo RegistroMaoObra"""
    
    list_display = ['apontador', 'obra', 'data', 'total_funcionarios', 'validado']
    list_filter = ['validado', 'data', 'obra']
    search_fields = ['apontador__nome', 'obra__nome', 'local']
    ordering = ['-data', '-created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(ServicoExecutado)
class ServicoExecutadoAdmin(admin.ModelAdmin):
    """Admin para modelo ServicoExecutado"""
    
    list_display = ['registro', 'atividade', 'quantidade', 'unidade']
    list_filter = ['atividade', 'unidade']
    search_fields = ['atividade__descricao']


@admin.register(AtividadeEquipe)
class AtividadeEquipeAdmin(admin.ModelAdmin):
    """Admin para modelo AtividadeEquipe"""
    
    list_display = ['descricao', 'encarregado', 'obra', 'data', 'status']
    list_filter = ['status', 'data', 'obra']
    search_fields = ['descricao', 'encarregado__nome', 'local']
    ordering = ['-data', '-hora_inicio']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(DiarioObra)
class DiarioObraAdmin(admin.ModelAdmin):
    """Admin para modelo DiarioObra"""
    
    list_display = ['obra', 'data', 'encarregado', 'total_funcionarios', 'atividades_concluidas']
    list_filter = ['data', 'obra']
    search_fields = ['obra__nome', 'encarregado__nome']
    ordering = ['-data']
    readonly_fields = ['created_at', 'updated_at']
