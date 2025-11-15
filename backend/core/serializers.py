from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import (
    Usuario, Obra, Equipamento, Contrato, CriterioMedicao,
    CategoriaAtividade, Atividade, RegistroEquipamento, 
    RegistroMaoObra, ServicoExecutado, AtividadeEquipe, DiarioObra
)


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer para modelo Usuario"""
    
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'email', 'matricula', 'nome', 'cpf', 'telefone',
            'tipo_usuario', 'funcao', 'cargo', 'is_active', 
            'is_staff', 'password', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        usuario = Usuario.objects.create(**validated_data)
        
        if password:
            usuario.set_password(password)
            usuario.save()
        
        return usuario
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    """Serializer para login (email para admin, matrícula para outros)"""
    
    email = serializers.EmailField(required=False, allow_blank=True)
    matricula = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        matricula = data.get('matricula')
        password = data.get('password')
        
        # Precisa fornecer email OU matrícula
        if not email and not matricula:
            raise serializers.ValidationError('Forneça email ou matrícula para login')
        
        # Busca usuário por email ou matrícula
        user = None
        if email:
            try:
                user = Usuario.objects.get(email=email)
            except Usuario.DoesNotExist:
                raise serializers.ValidationError('Credenciais inválidas')
        elif matricula:
            try:
                user = Usuario.objects.get(matricula=matricula)
            except Usuario.DoesNotExist:
                raise serializers.ValidationError('Credenciais inválidas')
        
        # Valida senha
        if user and not user.check_password(password):
            raise serializers.ValidationError('Credenciais inválidas')
        
        if not user.is_active:
            raise serializers.ValidationError('Usuário inativo')
        
        data['user'] = user
        return data


class RegistroSerializer(serializers.ModelSerializer):
    """Serializer para registro de novos usuários"""
    
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = Usuario
        fields = [
            'email', 'matricula', 'nome', 'cpf', 'telefone',
            'tipo_usuario', 'funcao', 'cargo', 'password', 'password_confirm'
        ]
    
    def validate(self, data):
        # Validação de senhas
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError('As senhas não coincidem')
        
        # Validação baseada no tipo de usuário
        tipo = data.get('tipo_usuario')
        
        if tipo == 'admin' and not data.get('email'):
            raise serializers.ValidationError('Admin precisa fornecer email')
        
        if tipo in ['apontador', 'encarregado', 'motorista'] and not data.get('matricula'):
            raise serializers.ValidationError(f'{tipo.capitalize()} precisa fornecer matrícula')
        
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        usuario = Usuario.objects.create(**validated_data)
        usuario.set_password(password)
        usuario.save()
        
        return usuario


class ObraSerializer(serializers.ModelSerializer):
    """Serializer para modelo Obra"""
    
    responsavel_nome = serializers.CharField(source='responsavel.nome', read_only=True)
    
    class Meta:
        model = Obra
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class EquipamentoSerializer(serializers.ModelSerializer):
    """Serializer para modelo Equipamento"""
    
    obra_nome = serializers.CharField(source='obra.nome', read_only=True)
    motorista_nome = serializers.CharField(source='motorista_atual.nome', read_only=True)
    
    class Meta:
        model = Equipamento
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ContratoSerializer(serializers.ModelSerializer):
    """Serializer para modelo Contrato"""
    
    obra_nome = serializers.CharField(source='obra.nome', read_only=True)
    
    class Meta:
        model = Contrato
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class CriterioMedicaoSerializer(serializers.ModelSerializer):
    """Serializer para modelo CriterioMedicao"""
    
    obra_nome = serializers.CharField(source='obra.nome', read_only=True)
    
    class Meta:
        model = CriterioMedicao
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class CategoriaAtividadeSerializer(serializers.ModelSerializer):
    """Serializer para modelo CategoriaAtividade"""
    
    class Meta:
        model = CategoriaAtividade
        fields = '__all__'


class AtividadeSerializer(serializers.ModelSerializer):
    """Serializer para modelo Atividade"""
    
    obra_nome = serializers.CharField(source='obra.nome', read_only=True)
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)
    
    class Meta:
        model = Atividade
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class RegistroEquipamentoSerializer(serializers.ModelSerializer):
    """Serializer para modelo RegistroEquipamento"""
    
    equipamento_nome = serializers.CharField(source='equipamento.nome', read_only=True)
    motorista_nome = serializers.CharField(source='motorista.nome', read_only=True)
    apontador_nome = serializers.CharField(source='apontador.nome', read_only=True)
    horas_trabalhadas = serializers.ReadOnlyField()
    horimetro_trabalhado = serializers.ReadOnlyField()
    
    class Meta:
        model = RegistroEquipamento
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'validado_por', 'data_validacao']


class ServicoExecutadoSerializer(serializers.ModelSerializer):
    """Serializer para modelo ServicoExecutado"""
    
    atividade_descricao = serializers.CharField(source='atividade.descricao', read_only=True)
    
    class Meta:
        model = ServicoExecutado
        fields = '__all__'


class RegistroMaoObraSerializer(serializers.ModelSerializer):
    """Serializer para modelo RegistroMaoObra"""
    
    apontador_nome = serializers.CharField(source='apontador.nome', read_only=True)
    obra_nome = serializers.CharField(source='obra.nome', read_only=True)
    servicos = ServicoExecutadoSerializer(many=True, read_only=True)
    funcionarios_nomes = serializers.SerializerMethodField()
    
    class Meta:
        model = RegistroMaoObra
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'validado_por']
    
    def get_funcionarios_nomes(self, obj):
        return [f.nome for f in obj.funcionarios_presentes.all()]


class AtividadeEquipeSerializer(serializers.ModelSerializer):
    """Serializer para modelo AtividadeEquipe"""
    
    encarregado_nome = serializers.CharField(source='encarregado.nome', read_only=True)
    obra_nome = serializers.CharField(source='obra.nome', read_only=True)
    funcionarios_nomes = serializers.SerializerMethodField()
    
    class Meta:
        model = AtividadeEquipe
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def get_funcionarios_nomes(self, obj):
        return [f.nome for f in obj.funcionarios.all()]


class DiarioObraSerializer(serializers.ModelSerializer):
    """Serializer para modelo DiarioObra"""
    
    encarregado_nome = serializers.CharField(source='encarregado.nome', read_only=True)
    obra_nome = serializers.CharField(source='obra.nome', read_only=True)
    atividades_detalhes = AtividadeEquipeSerializer(source='atividades', many=True, read_only=True)
    equipamentos_detalhes = RegistroEquipamentoSerializer(source='equipamentos', many=True, read_only=True)
    
    class Meta:
        model = DiarioObra
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class LoginSerializer(serializers.Serializer):
    """
    Serializer para login - aceita email OU matrícula
    Baseado nos 4 tipos de login do frontend:
    - Admin: email + senha
    - Apontador/Encarregado/Motorista: matrícula + senha
    """
    
    email = serializers.EmailField(required=False, allow_blank=True)
    matricula = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    def validate(self, data):
        email = data.get('email')
        matricula = data.get('matricula')
        password = data.get('password')
        
        if not email and not matricula:
            raise serializers.ValidationError(
                'É necessário fornecer email ou matrícula para login'
            )
        
        # Tenta autenticar com email ou matrícula
        user = None
        
        if email:
            try:
                user = Usuario.objects.get(email=email)
            except Usuario.DoesNotExist:
                raise serializers.ValidationError('Credenciais inválidas')
        elif matricula:
            try:
                user = Usuario.objects.get(matricula=matricula)
            except Usuario.DoesNotExist:
                raise serializers.ValidationError('Credenciais inválidas')
        
        # Verifica senha
        if user and not user.check_password(password):
            raise serializers.ValidationError('Credenciais inválidas')
        
        if not user.is_active:
            raise serializers.ValidationError('Usuário inativo')
        
        data['user'] = user
        return data


class RegistroSerializer(serializers.ModelSerializer):
    """
    Serializer para registro de novos usuários
    """
    
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = Usuario
        fields = [
            'email', 'matricula', 'nome', 'cpf', 'telefone',
            'tipo_usuario', 'funcao', 'cargo', 'password', 'password_confirm'
        ]
    
    def validate(self, data):
        """Valida se as senhas conferem"""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password': 'As senhas não conferem'})
        
        # Valida se admin tem email
        if data['tipo_usuario'] == 'admin' and not data.get('email'):
            raise serializers.ValidationError({'email': 'Administrador deve ter email'})
        
        # Valida se outros tipos têm matrícula
        if data['tipo_usuario'] != 'admin' and not data.get('matricula'):
            raise serializers.ValidationError({'matricula': f"{data['tipo_usuario'].capitalize()} deve ter matrícula"})
        
        return data
    
    def create(self, validated_data):
        """Cria usuário com senha hash"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        usuario = Usuario.objects.create(**validated_data)
        usuario.set_password(password)
        usuario.save()
        
        return usuario


class ObraSerializer(serializers.ModelSerializer):
    """Serializer para o modelo Obra"""
    
    responsavel_nome = serializers.CharField(source='responsavel.nome', read_only=True)
    
    class Meta:
        model = Obra
        fields = [
            'id', 'nome', 'codigo', 'local', 'km_inicial', 'km_final',
            'data_inicio', 'data_prevista_fim', 'responsavel', 'responsavel_nome',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
