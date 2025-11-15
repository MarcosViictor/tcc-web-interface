"""
Script para criar usuários de teste
Execute: python manage.py shell < create_test_users.py
"""

from core.models import Usuario

print("🚀 Criando usuários de teste...\n")

# Admin
admin, created = Usuario.objects.get_or_create(
    email="admin@tcc.com",
    defaults={
        'nome': 'Administrador Sistema',
        'tipo_usuario': 'admin',
        'funcao': 'engenheiro',
        'cargo': 'Engenheiro Responsável',
        'cpf': '111.111.111-11',
        'telefone': '(11) 91111-1111',
        'is_staff': True,
        'is_superuser': True,
    }
)
if created:
    admin.set_password('admin123')
    admin.save()
    print("✅ Admin criado - Email: admin@tcc.com | Senha: admin123")
else:
    print("⚠️  Admin já existe")

# Apontador
apontador, created = Usuario.objects.get_or_create(
    matricula="001234",
    defaults={
        'nome': 'Carlos Santos',
        'tipo_usuario': 'apontador',
        'funcao': 'apontador',
        'cargo': 'Apontador de Obra',
        'cpf': '222.222.222-22',
        'telefone': '(11) 92222-2222',
    }
)
if created:
    apontador.set_password('apontador123')
    apontador.save()
    print("✅ Apontador criado - Matrícula: 001234 | Senha: apontador123")
else:
    print("⚠️  Apontador já existe")

# Encarregado
encarregado, created = Usuario.objects.get_or_create(
    matricula="001235",
    defaults={
        'nome': 'Pedro Santos',
        'tipo_usuario': 'encarregado',
        'funcao': 'encarregado',
        'cargo': 'Encarregado de Equipe',
        'cpf': '333.333.333-33',
        'telefone': '(11) 93333-3333',
    }
)
if created:
    encarregado.set_password('encarregado123')
    encarregado.save()
    print("✅ Encarregado criado - Matrícula: 001235 | Senha: encarregado123")
else:
    print("⚠️  Encarregado já existe")

# Motorista
motorista, created = Usuario.objects.get_or_create(
    matricula="001236",
    defaults={
        'nome': 'João Silva',
        'tipo_usuario': 'motorista',
        'funcao': 'motorista',
        'cargo': 'Motorista/Operador',
        'cpf': '444.444.444-44',
        'telefone': '(11) 94444-4444',
    }
)
if created:
    motorista.set_password('motorista123')
    motorista.save()
    print("✅ Motorista criado - Matrícula: 001236 | Senha: motorista123")
else:
    print("⚠️  Motorista já existe")

print("\n✨ Processo concluído!")
print("\n📋 Resumo dos usuários:")
print("━" * 60)
print("Admin:")
print("  Email: admin@tcc.com")
print("  Senha: admin123")
print("\nApontador:")
print("  Matrícula: 001234")
print("  Senha: apontador123")
print("\nEncarregado:")
print("  Matrícula: 001235")
print("  Senha: encarregado123")
print("\nMotorista:")
print("  Matrícula: 001236")
print("  Senha: motorista123")
print("━" * 60)
