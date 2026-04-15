export const APP_CONFIG = {
  siteName: "Bitzen Mineria SEO Demo",
  brandName: "Bitzen Mineria",
  model: "claude-sonnet-4-20250514",
  maxTokens: 8000,
  introExcerptLength: 150,
  previewKeywordCount: 3,
  dateLocale: "es-ES",
} as const;

export const STORAGE_CONFIG = {
  articlesDirectory: "generated-articles",
} as const;

export const DEMO_LIMITS = {
  TITLE_MAX_LENGTH: 100,
  META_DESC_MAX_LENGTH: 170,
  OBSERVATIONS_MAX_LENGTH: 300,
  MAX_TOKENS: 4000,
  ARTICLE_WORD_TARGET: "600-800",
} as const;

export const ROUTES = {
  home: "/",
  login: "/login",
  admin: "/admin",
  preview: "/preview",
} as const;

export const UI_TEXT = {
  navHome: "Inicio",
  navAdmin: "Administrador",
  navLogin: "Login",
  heroEyebrow: "Demo SEO para cliente",
  heroTitle: "Generador de artículos SEO para Bitzen Mineria",
  heroDescription:
    "Crea contenido completo en español con metadatos SEO, FAQ y estructura lista para publicar, todo en tiempo real.",
  heroPrimaryCta: "Ir al panel admin",
  heroSecondaryCta: "Ver vista blog",
  adminTitle: "Generación y publicación en tiempo real",
  adminDescription:
    "Completa los datos editoriales y genera el artículo optimizado con streaming en vivo.",
  fieldTitle: "Título",
  fieldMetaDescription: "Meta descripción",
  fieldObservations: "Observaciones editoriales",
  fieldImage: "Imagen destacada",
  placeholderTitle: "Ej: Mejor hardware para minería de Bitcoin en 2026",
  placeholderMetaDescription:
    "Ej: Descubre el hardware más eficiente para minar Bitcoin este 2026...",
  placeholderObservations:
    "Notas opcionales sobre enfoque, tono o puntos clave.",
  imageUploadHint:
    "Sube una imagen para usarla en el artículo. Si no subes ninguna, Claude debe devolver la URL de imagen en el JSON.",
  imageAutoSearchLabel: "Sin imagen subida: se usará la URL devuelta por Claude",
  imageUploadedLabel: "Usando imagen subida por el usuario",
  imageUploadRequiredError:
    "Claude no devolvió una URL de imagen válida. Sube una imagen para continuar.",
  imageUploadButton: "Seleccionar imagen",
  imageDropZoneHint: "Arrastra y suelta una imagen aquí, o haz clic para elegir",
  imageReplaceDropHint: "Suelta otra imagen para reemplazar la actual",
  imageUploadingLabel: "Subiendo imagen...",
  imageUploadCompleteLabel: "Subida completada",
  imageRemoveFileAria: "Quitar imagen",
  imageUploadEmpty: "Ningún archivo seleccionado",
  imageApplyButton: "Usar imagen subida en el preview",
  imageOptionsTitle: "Elige imagen destacada",
  imageOptionsDescription:
    "Claude ha devuelto hasta 4 opciones. Selecciona la imagen que prefieras para el artículo.",
  imageUseOptionButton: "Usar esta imagen",
  imageSelectedLabel: "Seleccionada",
  imageRequiredForPublish:
    "Para publicar este artículo necesitas subir una imagen porque el JSON no trajo una URL válida.",
  approvalTitle: "Vista previa antes de publicar",
  approvalDescription:
    "Revisa el artículo como lo verá el usuario final. Apruébalo para publicarlo o regénéralo.",
  approvePublishButton: "Aprobar y Publicar",
  regenerateButton: "Regenerar artículo",
  publishSuccessToast: "Artículo publicado correctamente.",
  duplicateTitleError: "Ya existe un artículo con este título. Cambia el título o regenera otro.",
  generateButton: "Generar Articulo",
  generatingButton: "Generando...",
  retryButton: "Reintentar",
  viewArticleButton: "Ver Artículo",
  viewBlogButton: "Ver Blog",
  streamPreviewTitle: "Streaming en vivo",
  streamPreviewFallback: "Aquí aparecerá el JSON generado en tiempo real.",
  streamPreviewError:
    "No se pudo procesar la respuesta como JSON válido. Puedes reintentar.",
  blogTitle: "Vista previa del blog",
  blogDescription: "Artículos generados durante esta sesión (sin base de datos).",
  emptyStateTitle: "No hay artículos generados todavía",
  emptyStateCta: "Crear primer artículo",
  seoPanelTitle: "Datos SEO",
  seoMetaTagsTitle: "Meta tags",
  seoKeywordsTitle: "Keywords",
  seoSchemaTitle: "JSON-LD",
  seoSitemapTitle: "Sitemap entry",
  faqTitle: "Preguntas frecuentes",
  conclusionTitle: "Conclusión",
  copyHtmlButton: "Copiar HTML",
  copyMetaButton: "Copiar Meta Tags",
  copySchemaButton: "Copiar Schema JSON-LD",
  copySitemapButton: "Copiar Sitemap Entry",
  articleNotFound: "Artículo no encontrado en memoria.",
  backToBlog: "Volver al blog",
  footerText: "Demo técnica · Sin base de datos",
  footerTagline:
    "Generación de artículos SEO con Claude AI: streaming en vivo, JSON estructurado, imágenes WebP y auditoría antes de publicar.",
  loginTitle: "Acceso Administrador",
  loginDescription: "Inicia sesión para acceder al panel y a las vistas internas.",
  loginUserLabel: "Usuario",
  loginPasswordLabel: "Contraseña",
  loginRememberUserLabel: "Recordar usuario",
  loginButton: "Entrar",
  loginInvalid: "Credenciales inválidas.",
} as const;

export const ERROR_TEXT = {
  requiredFields: "Título y meta descripción son obligatorios.",
  generationFailed: "No se pudo generar el artículo.",
  saveFailed: "No se pudo guardar el artículo en el sistema de archivos.",
  missingApiKey: "Falta configurar ANTHROPIC_API_KEY.",
  invalidJson: "La respuesta del modelo no devolvió JSON válido.",
} as const;
