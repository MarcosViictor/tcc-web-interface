"""
Script para testar importação de CSV localmente
Execute: python test_import_csv.py
"""

import os
import sys
import django

# Configura Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')
django.setup()

from core.importers import (
    ObraCSVImporter,
    EquipamentoCSVImporter,
    UsuarioCSVImporter,
    AtividadeCSVImporter,
    RegistroEquipamentoCSVImporter,
    RegistroMaoObraCSVImporter,
    DiarioObraCSVImporter
)

def test_import(importer_class, csv_path, tipo):
    """Testa importação de um CSV"""
    print(f"\n{'='*60}")
    print(f"🔄 Testando importação de: {tipo}")
    print(f"📁 Arquivo: {csv_path}")
    print(f"{'='*60}")
    
    try:
        with open(csv_path, 'rb') as f:
            importer = importer_class(f)
            result = importer.import_data()
            
            print(f"\n✅ Importação concluída!")
            print(f"   ✔️  Sucesso: {result['success']}")
            print(f"   ❌ Erros: {result['errors']}")
            print(f"   ⏭️  Ignorados: {result['skipped']}")
            print(f"   📊 Total: {result['total']}")
            
            if result['error_details']:
                print(f"\n⚠️  Detalhes dos erros:")
                for error in result['error_details']:
                    print(f"   Linha {error['row']}: {error['error']}")
                    
            return True
            
    except Exception as e:
        print(f"\n❌ Erro ao importar: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Executa todos os testes de importação"""
    base_path = os.path.join(os.path.dirname(__file__), 'exemplos_csv')
    
    tests = [
        (UsuarioCSVImporter, 'exemplo_usuarios.csv', 'Usuários'),
        (ObraCSVImporter, 'exemplo_obras.csv', 'Obras'),
        (EquipamentoCSVImporter, 'exemplo_equipamentos.csv', 'Equipamentos'),
        (AtividadeCSVImporter, 'exemplo_atividades.csv', 'Atividades'),
        (RegistroEquipamentoCSVImporter, 'exemplo_registros_equipamentos.csv', 'Registros de Equipamentos'),
        (RegistroMaoObraCSVImporter, 'exemplo_registros_mao_obra.csv', 'Registros de Mão de Obra'),
        (DiarioObraCSVImporter, 'exemplo_diarios_obra.csv', 'Diários de Obra'),
    ]
    
    print("\n" + "="*60)
    print("🚀 INICIANDO TESTES DE IMPORTAÇÃO CSV")
    print("="*60)
    
    results = []
    
    for importer_class, filename, tipo in tests:
        csv_path = os.path.join(base_path, filename)
        
        if not os.path.exists(csv_path):
            print(f"\n⚠️  Arquivo não encontrado: {csv_path}")
            results.append(False)
            continue
        
        success = test_import(importer_class, csv_path, tipo)
        results.append(success)
    
    # Resumo final
    print("\n" + "="*60)
    print("📊 RESUMO DOS TESTES")
    print("="*60)
    
    total = len(results)
    passed = sum(results)
    failed = total - passed
    
    print(f"\n   Total de testes: {total}")
    print(f"   ✅ Passaram: {passed}")
    print(f"   ❌ Falharam: {failed}")
    
    if failed == 0:
        print("\n🎉 TODOS OS TESTES PASSARAM!")
    else:
        print(f"\n⚠️  {failed} teste(s) falharam")
    
    print("\n" + "="*60)


if __name__ == '__main__':
    main()
