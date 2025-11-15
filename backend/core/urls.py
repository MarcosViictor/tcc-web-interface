from django.urls import path
from . import views

urlpatterns = [
    # ========== AUTENTICAÇÃO ==========
    path('auth/registro', views.RegistroView.as_view(), name='registro'),
    path('auth/login', views.LoginView.as_view(), name='login'),
    path('auth/logout', views.LogoutView.as_view(), name='logout'),
    path('auth/me', views.MeView.as_view(), name='me'),
    
    # ========== USUÁRIOS ==========
    path('usuarios', views.UsuarioListCreateView.as_view(), name='usuario-list-create'),
    path('usuarios/<int:pk>', views.UsuarioDetailView.as_view(), name='usuario-detail'),
    
    # ========== OBRAS ==========
    path('obras', views.ObraListCreateView.as_view(), name='obra-list-create'),
    path('obras/<int:pk>', views.ObraDetailView.as_view(), name='obra-detail'),
    
    # ========== EQUIPAMENTOS ==========
    path('equipamentos', views.EquipamentoListCreateView.as_view(), name='equipamento-list-create'),
    path('equipamentos/<int:pk>', views.EquipamentoDetailView.as_view(), name='equipamento-detail'),
    
    # ========== CONTRATOS ==========
    path('contratos', views.ContratoListCreateView.as_view(), name='contrato-list-create'),
    path('contratos/<int:pk>', views.ContratoDetailView.as_view(), name='contrato-detail'),
    
    # ========== CRITÉRIOS DE MEDIÇÃO ==========
    path('criterios-medicao', views.CriterioMedicaoListCreateView.as_view(), name='criterio-medicao-list-create'),
    path('criterios-medicao/<int:pk>', views.CriterioMedicaoDetailView.as_view(), name='criterio-medicao-detail'),
    
    # ========== CATEGORIAS DE ATIVIDADES ==========
    path('categorias-atividades', views.CategoriaAtividadeListCreateView.as_view(), name='categoria-atividade-list-create'),
    path('categorias-atividades/<int:pk>', views.CategoriaAtividadeDetailView.as_view(), name='categoria-atividade-detail'),
    
    # ========== ATIVIDADES ==========
    path('atividades', views.AtividadeListCreateView.as_view(), name='atividade-list-create'),
    path('atividades/<int:pk>', views.AtividadeDetailView.as_view(), name='atividade-detail'),
    
    # ========== REGISTROS DE EQUIPAMENTOS ==========
    path('registros-equipamentos', views.RegistroEquipamentoListCreateView.as_view(), name='registro-equipamento-list-create'),
    path('registros-equipamentos/<int:pk>', views.RegistroEquipamentoDetailView.as_view(), name='registro-equipamento-detail'),
    path('registros-equipamentos/<int:pk>/validar', views.ValidarRegistroEquipamentoView.as_view(), name='registro-equipamento-validar'),
    
    # ========== REGISTROS DE MÃO DE OBRA ==========
    path('registros-mao-obra', views.RegistroMaoObraListCreateView.as_view(), name='registro-mao-obra-list-create'),
    path('registros-mao-obra/<int:pk>', views.RegistroMaoObraDetailView.as_view(), name='registro-mao-obra-detail'),
    path('registros-mao-obra/<int:pk>/validar', views.ValidarRegistroMaoObraView.as_view(), name='registro-mao-obra-validar'),
    
    # ========== ATIVIDADES DA EQUIPE ==========
    path('atividades-equipe', views.AtividadeEquipeListCreateView.as_view(), name='atividade-equipe-list-create'),
    path('atividades-equipe/<int:pk>', views.AtividadeEquipeDetailView.as_view(), name='atividade-equipe-detail'),
    
    # ========== DIÁRIOS DE OBRA ==========
    path('diarios-obra', views.DiarioObraListCreateView.as_view(), name='diario-obra-list-create'),
    path('diarios-obra/<int:pk>', views.DiarioObraDetailView.as_view(), name='diario-obra-detail'),
    
    # ========== DASHBOARD ==========
    path('dashboard/stats', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    
    # ========== IMPORTAÇÃO/EXPORTAÇÃO CSV ==========
    path('importar-csv', views.ImportarCSVView.as_view(), name='importar-csv'),
    path('modelo-csv/<str:tipo>', views.DownloadModeloCSVView.as_view(), name='modelo-csv'),
    path('exportar-csv/<str:tipo>', views.ExportarCSVView.as_view(), name='exportar-csv'),
]
