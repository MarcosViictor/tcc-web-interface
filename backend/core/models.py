from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


class UsuarioManager(BaseUserManager):
    """Manager personalizado para o modelo Usuario"""
    
    def create_user(self, email=None, matricula=None, password=None, **extra_fields):
        """Cria e retorna um usuário comum"""
        if not email and not matricula:
            raise ValueError('Usuário deve ter email ou matrícula')
        
        if email:
            email = self.normalize_email(email)
        
        user = self.model(email=email, matricula=matricula, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Cria e retorna um superusuário (admin)"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('tipo_usuario', 'admin')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser deve ter is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser deve ter is_superuser=True')
        
        return self.create_user(email=email, password=password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    """
    Modelo de usuário customizado baseado nos 4 perfis do sistema:
    - Admin: acesso total, gerenciamento de cadastros
    - Apontador: registro de equipamentos e mão de obra
    - Encarregado: gestão de equipe e atividades
    - Motorista: registro de jornada de equipamento
    """
    
    TIPO_USUARIO_CHOICES = [
        ('admin', 'Administrador'),
        ('apontador', 'Apontador'),
        ('encarregado', 'Encarregado'),
        ('motorista', 'Motorista'),
    ]
    
    FUNCAO_CHOICES = [
        ('engenheiro', 'Engenheiro'),
        ('tecnico', 'Técnico'),
        ('encarregado', 'Encarregado'),
        ('apontador', 'Apontador'),
        ('motorista', 'Motorista'),
        ('operador', 'Operador de Equipamento'),
        ('servente', 'Servente'),
        ('pedreiro', 'Pedreiro'),
        ('armador', 'Armador'),
        ('carpinteiro', 'Carpinteiro'),
        ('eletricista', 'Eletricista'),
        ('mecanico', 'Mecânico'),
    ]
    
    # Campos de autenticação
    email = models.EmailField('E-mail', unique=True, null=True, blank=True)
    matricula = models.CharField('Matrícula', max_length=20, unique=True, null=True, blank=True)
    
    # Dados pessoais
    nome = models.CharField('Nome Completo', max_length=200)
    cpf = models.CharField('CPF', max_length=14, unique=True, null=True, blank=True)
    telefone = models.CharField('Telefone', max_length=20, null=True, blank=True)
    
    # Dados profissionais
    tipo_usuario = models.CharField('Tipo de Usuário', max_length=20, choices=TIPO_USUARIO_CHOICES)
    funcao = models.CharField('Função', max_length=50, choices=FUNCAO_CHOICES, null=True, blank=True)
    cargo = models.CharField('Cargo', max_length=100, null=True, blank=True)
    
    # Status
    is_active = models.BooleanField('Ativo', default=True)
    is_staff = models.BooleanField('Staff', default=False)
    
    # Timestamps
    created_at = models.DateTimeField('Criado em', auto_now_add=True)
    updated_at = models.DateTimeField('Atualizado em', auto_now=True)
    
    objects = UsuarioManager()
    
    USERNAME_FIELD = 'email'  # Campo usado para login (email ou matrícula)
    REQUIRED_FIELDS = ['nome']
    
    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.nome} ({self.get_tipo_usuario_display()})"
    
    def get_full_name(self):
        return self.nome
    
    def get_short_name(self):
        return self.nome.split()[0] if self.nome else ''
    
    @property
    def is_admin(self):
        return self.tipo_usuario == 'admin'
    
    @property
    def is_apontador(self):
        return self.tipo_usuario == 'apontador'
    
    @property
    def is_encarregado(self):
        return self.tipo_usuario == 'encarregado'
    
    @property
    def is_motorista(self):
        return self.tipo_usuario == 'motorista'


class Obra(models.Model):
    """Modelo para cadastro de obras"""
    
    STATUS_CHOICES = [
        ('planejamento', 'Planejamento'),
        ('em_andamento', 'Em Andamento'),
        ('pausada', 'Pausada'),
        ('concluida', 'Concluída'),
    ]
    
    nome = models.CharField('Nome da Obra', max_length=200)
    codigo = models.CharField('Código', max_length=50, unique=True)
    local = models.CharField('Local', max_length=300)
    km_inicial = models.DecimalField('KM Inicial', max_digits=10, decimal_places=3)
    km_final = models.DecimalField('KM Final', max_digits=10, decimal_places=3)
    data_inicio = models.DateField('Data de Início')
    data_prevista_fim = models.DateField('Data Prevista de Término')
    responsavel = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='obras_responsavel')
    status = models.CharField('Status', max_length=20, choices=STATUS_CHOICES, default='planejamento')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Obra'
        verbose_name_plural = 'Obras'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.codigo} - {self.nome}"


class Equipamento(models.Model):
    """Modelo para cadastro de equipamentos"""
    
    TIPO_CHOICES = [
        ('caminhao', 'Caminhão'),
        ('escavadeira', 'Escavadeira'),
        ('rolo_compactador', 'Rolo Compactador'),
        ('motoniveladora', 'Motoniveladora'),
        ('retroescavadeira', 'Retroescavadeira'),
        ('trator', 'Trator'),
        ('carregadeira', 'Carregadeira'),
        ('patrol', 'Patrol'),
    ]
    
    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('manutencao', 'Em Manutenção'),
        ('inativo', 'Inativo'),
    ]
    
    nome = models.CharField('Nome', max_length=200)
    tipo = models.CharField('Tipo', max_length=50, choices=TIPO_CHOICES)
    modelo = models.CharField('Modelo', max_length=100)
    placa = models.CharField('Placa', max_length=20, unique=True)
    fabricante = models.CharField('Fabricante', max_length=100)
    ano = models.IntegerField('Ano de Fabricação')
    horimetro_atual = models.DecimalField('Horímetro Atual', max_digits=10, decimal_places=1, default=0)
    status = models.CharField('Status', max_length=20, choices=STATUS_CHOICES, default='ativo')
    obra = models.ForeignKey(Obra, on_delete=models.SET_NULL, null=True, blank=True, related_name='equipamentos')
    motorista_atual = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='equipamentos_operando')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Equipamento'
        verbose_name_plural = 'Equipamentos'
        ordering = ['nome']
    
    def __str__(self):
        return f"{self.nome} - {self.placa}"


class Contrato(models.Model):
    """Modelo para cadastro de contratos/fornecedores"""
    
    TIPO_CHOICES = [
        ('materiais', 'Materiais'),
        ('mao_obra', 'Mão de Obra'),
        ('equipamentos', 'Equipamentos'),
        ('servicos', 'Serviços'),
        ('consultoria', 'Consultoria'),
        ('locacao', 'Locação'),
        ('manutencao', 'Manutenção'),
        ('outros', 'Outros'),
    ]
    
    fornecedor = models.CharField('Fornecedor', max_length=200)
    cnpj = models.CharField('CNPJ', max_length=18, unique=True)
    tipo = models.CharField('Tipo', max_length=50, choices=TIPO_CHOICES)
    numero_contrato = models.CharField('Número do Contrato', max_length=50, unique=True)
    valor_mensal = models.DecimalField('Valor Mensal', max_digits=12, decimal_places=2)
    data_inicio = models.DateField('Data de Início')
    data_fim = models.DateField('Data de Término')
    obra = models.ForeignKey(Obra, on_delete=models.CASCADE, related_name='contratos')
    ativo = models.BooleanField('Ativo', default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Contrato'
        verbose_name_plural = 'Contratos'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.fornecedor} - {self.numero_contrato}"


class CriterioMedicao(models.Model):
    """Modelo para critérios de medição (descontos/acréscimos)"""
    
    TIPO_CHOICES = [
        ('desconto', 'Desconto'),
        ('acrescimo', 'Acréscimo'),
    ]
    
    nome = models.CharField('Nome', max_length=200)
    tipo = models.CharField('Tipo', max_length=20, choices=TIPO_CHOICES)
    percentual = models.DecimalField('Percentual', max_digits=5, decimal_places=2)
    condicao = models.TextField('Condição de Aplicação')
    aplicacao = models.CharField('Aplicação', max_length=200)
    ativo = models.BooleanField('Ativo', default=True)
    obra = models.ForeignKey(Obra, on_delete=models.CASCADE, related_name='criterios_medicao')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Critério de Medição'
        verbose_name_plural = 'Critérios de Medição'
        ordering = ['nome']
    
    def __str__(self):
        return f"{self.nome} ({self.get_tipo_display()})"


class CategoriaAtividade(models.Model):
    """Categorias de atividades"""
    
    nome = models.CharField('Nome', max_length=100, unique=True)
    descricao = models.TextField('Descrição', blank=True)
    
    class Meta:
        verbose_name = 'Categoria de Atividade'
        verbose_name_plural = 'Categorias de Atividades'
        ordering = ['nome']
    
    def __str__(self):
        return self.nome


class Atividade(models.Model):
    """Modelo para cadastro de atividades/serviços"""
    
    UNIDADE_CHOICES = [
        ('m', 'Metro (m)'),
        ('m2', 'Metro Quadrado (m²)'),
        ('m3', 'Metro Cúbico (m³)'),
        ('kg', 'Quilograma (kg)'),
        ('t', 'Tonelada (t)'),
        ('un', 'Unidade (un)'),
        ('h', 'Hora (h)'),
        ('dia', 'Dia'),
    ]
    
    codigo = models.CharField('Código', max_length=50, unique=True)
    descricao = models.CharField('Descrição', max_length=300)
    unidade = models.CharField('Unidade', max_length=10, choices=UNIDADE_CHOICES)
    categoria = models.ForeignKey(CategoriaAtividade, on_delete=models.SET_NULL, null=True, related_name='atividades')
    preco_unitario = models.DecimalField('Preço Unitário', max_digits=12, decimal_places=2)
    obra = models.ForeignKey(Obra, on_delete=models.CASCADE, related_name='atividades')
    ativa = models.BooleanField('Ativa', default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Atividade'
        verbose_name_plural = 'Atividades'
        ordering = ['codigo']
    
    def __str__(self):
        return f"{self.codigo} - {self.descricao}"


class RegistroEquipamento(models.Model):
    """Registro diário de equipamento (pelo apontador ou motorista)"""
    
    equipamento = models.ForeignKey(Equipamento, on_delete=models.CASCADE, related_name='registros')
    motorista = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='registros_motorista')
    apontador = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='registros_apontador')
    
    data = models.DateField('Data')
    horimetro_inicial = models.DecimalField('Horímetro Inicial', max_digits=10, decimal_places=1)
    horimetro_final = models.DecimalField('Horímetro Final', max_digits=10, decimal_places=1)
    hora_inicio = models.TimeField('Hora Início')
    hora_fim = models.TimeField('Hora Fim')
    
    atividade_principal = models.CharField('Atividade Principal', max_length=100)
    local = models.CharField('Local de Operação', max_length=300)
    observacoes = models.TextField('Observações', blank=True)
    
    # Fotos (armazenar caminhos separados por vírgula ou usar JSONField)
    fotos = models.JSONField('Fotos', default=list, blank=True)
    
    validado = models.BooleanField('Validado', default=False)
    validado_por = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='registros_validados')
    data_validacao = models.DateTimeField('Data de Validação', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Registro de Equipamento'
        verbose_name_plural = 'Registros de Equipamentos'
        ordering = ['-data', '-created_at']
        unique_together = ['equipamento', 'data']
    
    def __str__(self):
        return f"{self.equipamento.nome} - {self.data}"
    
    @property
    def horas_trabalhadas(self):
        """Calcula horas trabalhadas"""
        from datetime import datetime, timedelta
        inicio = datetime.combine(datetime.today(), self.hora_inicio)
        fim = datetime.combine(datetime.today(), self.hora_fim)
        diff = fim - inicio
        return diff.total_seconds() / 3600
    
    @property
    def horimetro_trabalhado(self):
        """Calcula horímetro trabalhado"""
        return float(self.horimetro_final - self.horimetro_inicial)


class RegistroMaoObra(models.Model):
    """Registro de mão de obra (equipe)"""
    
    apontador = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='registros_mao_obra_criados')
    data = models.DateField('Data')
    obra = models.ForeignKey(Obra, on_delete=models.CASCADE, related_name='registros_mao_obra')
    
    # Funcionários presentes
    funcionarios_presentes = models.ManyToManyField(Usuario, related_name='presencas', blank=True)
    total_funcionarios = models.IntegerField('Total de Funcionários', default=0)
    
    hora_inicio = models.TimeField('Hora Início')
    hora_fim = models.TimeField('Hora Fim')
    local = models.CharField('Local', max_length=300)
    
    observacoes = models.TextField('Observações', blank=True)
    fotos = models.JSONField('Fotos', default=list, blank=True)
    
    validado = models.BooleanField('Validado', default=False)
    validado_por = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='mao_obra_validados')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Registro de Mão de Obra'
        verbose_name_plural = 'Registros de Mão de Obra'
        ordering = ['-data', '-created_at']
    
    def __str__(self):
        return f"Mão de Obra - {self.data}"


class ServicoExecutado(models.Model):
    """Serviços executados em um registro de mão de obra"""
    
    registro = models.ForeignKey(RegistroMaoObra, on_delete=models.CASCADE, related_name='servicos')
    atividade = models.ForeignKey(Atividade, on_delete=models.CASCADE)
    quantidade = models.DecimalField('Quantidade', max_digits=10, decimal_places=2)
    unidade = models.CharField('Unidade', max_length=10)
    
    class Meta:
        verbose_name = 'Serviço Executado'
        verbose_name_plural = 'Serviços Executados'
    
    def __str__(self):
        return f"{self.atividade.codigo} - {self.quantidade} {self.unidade}"


class AtividadeEquipe(models.Model):
    """Atividades criadas pelo encarregado para a equipe"""
    
    encarregado = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='atividades_criadas')
    obra = models.ForeignKey(Obra, on_delete=models.CASCADE, related_name='atividades_equipe')
    
    descricao = models.CharField('Descrição', max_length=300)
    data = models.DateField('Data')
    hora_inicio = models.TimeField('Hora Início')
    hora_fim = models.TimeField('Hora Fim', null=True, blank=True)
    local = models.CharField('Local', max_length=300)
    
    funcionarios = models.ManyToManyField(Usuario, related_name='atividades_alocadas')
    observacoes = models.TextField('Observações', blank=True)
    
    STATUS_CHOICES = [
        ('planejada', 'Planejada'),
        ('em_andamento', 'Em Andamento'),
        ('concluida', 'Concluída'),
        ('cancelada', 'Cancelada'),
    ]
    status = models.CharField('Status', max_length=20, choices=STATUS_CHOICES, default='planejada')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Atividade da Equipe'
        verbose_name_plural = 'Atividades da Equipe'
        ordering = ['-data', '-hora_inicio']
    
    def __str__(self):
        return f"{self.descricao} - {self.data}"


class DiarioObra(models.Model):
    """Diário de Obra (RDO)"""
    
    encarregado = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='diarios_criados')
    obra = models.ForeignKey(Obra, on_delete=models.CASCADE, related_name='diarios')
    data = models.DateField('Data')
    
    # Estatísticas do dia
    total_funcionarios = models.IntegerField('Total de Funcionários')
    funcionarios_presentes = models.IntegerField('Funcionários Presentes')
    atividades_concluidas = models.IntegerField('Atividades Concluídas', default=0)
    atividades_parciais = models.IntegerField('Atividades Parciais', default=0)
    
    # Condições
    condicoes_climaticas = models.CharField('Condições Climáticas', max_length=200)
    observacoes = models.TextField('Observações Gerais')
    
    # Relacionamentos
    atividades = models.ManyToManyField(AtividadeEquipe, related_name='diarios', blank=True)
    equipamentos = models.ManyToManyField(RegistroEquipamento, related_name='diarios', blank=True)
    
    # PDF gerado
    pdf_gerado = models.FileField('PDF', upload_to='diarios/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Diário de Obra'
        verbose_name_plural = 'Diários de Obra'
        ordering = ['-data']
        unique_together = ['obra', 'data', 'encarregado']
    
    def __str__(self):
        return f"RDO - {self.obra.codigo} - {self.data}"
