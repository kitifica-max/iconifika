import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos de Uso — Iconifika',
  description: 'Términos de uso, atribución y cumplimiento de licencias de Iconifika.',
}

const SECTIONS = [
  {
    id: 'uso',
    title: '1. Uso del servicio',
    content: `Iconifika es una herramienta gratuita que actúa como intermediario entre tu IA y la API de Iconify, dando acceso a más de 200,000 iconos SVG de código abierto. Puedes usarla a través del protocolo MCP o como Skill para Claude en proyectos personales, comerciales o de código abierto.`,
  },
  {
    id: 'iconos',
    title: '2. Propiedad de los iconos',
    content: `Iconifika no es la autora de los iconos. Los SVGs son propiedad de sus respectivos autores y se distribuyen bajo sus licencias originales (MIT, Apache 2.0, CC BY 4.0, entre otras). Iconifika únicamente los sirve a través de su API. Al insertar un ícono en tu proyecto, aceptas cumplir con la licencia correspondiente al set del que proviene.`,
  },
  {
    id: 'atribucion',
    title: '3. Atribución y cumplimiento de licencias',
    content: `Algunos sets de iconos requieren atribución explícita (por ejemplo, licencias CC BY o Apache 2.0). Cuando uses Iconifika con un agente de IA compatible (como Claude con la Skill oficial), el agente gestionará automáticamente esta atribución de la siguiente forma:

• El SVG se inserta limpio en tu código fuente — sin comentarios ni notas de licencia inline.
• Si la licencia del ícono requiere atribución, el agente crea o actualiza un archivo CREDITS.md en la raíz de tu proyecto con el siguiente formato:

  - Icono: [Nombre] del set [Nombre del Set] por [Autor] - Licencia: [Tipo]. Servido vía API Iconifika.

Si usas Iconifika fuera de un agente con IA (por ejemplo, consumiendo la API directamente), eres responsable de verificar y cumplir con las licencias de cada set que uses.`,
  },
  {
    id: 'prohibiciones',
    title: '4. Uso prohibido',
    content: `No está permitido:
• Redistribuir los iconos como propios sin respetar su licencia original.
• Usar la API de Iconifika para construir un servicio competidor de distribución de iconos.
• Realizar scraping masivo o solicitudes automatizadas que saturen el servicio.
• Usar Iconifika para proyectos que promuevan contenido ilegal, discriminatorio o que viole derechos de terceros.`,
  },
  {
    id: 'disponibilidad',
    title: '5. Disponibilidad del servicio',
    content: `Iconifika se ofrece "tal cual" y de forma gratuita. No garantizamos disponibilidad continua del 100%. Nos reservamos el derecho de modificar, suspender o descontinuar el servicio en cualquier momento sin previo aviso. No somos responsables por pérdidas derivadas de la no disponibilidad del servicio.`,
  },
  {
    id: 'cambios',
    title: '6. Cambios a estos términos',
    content: `Podemos actualizar estos términos en cualquier momento. Los cambios se publicarán en esta página. El uso continuado del servicio después de una actualización implica la aceptación de los nuevos términos.`,
  },
  {
    id: 'contacto',
    title: '7. Contacto',
    content: `Para dudas sobre estos términos o sobre el cumplimiento de licencias, escríbenos a hola@kitifica.com.`,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-8 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <img src="/iconifica_w.svg" alt="Iconifika" className="h-7 w-7" />
          <span className="text-sm font-semibold tracking-tight">Iconifika</span>
        </Link>
        <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors">
          ← Volver
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-8 py-16">
        <div className="mb-12">
          <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Última actualización: Julio 2025</p>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Términos de Uso</h1>
          <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
            Al usar Iconifika — ya sea como MCP, como Skill para Claude o consumiendo su API directamente — aceptas los siguientes términos.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {SECTIONS.map(s => (
            <section key={s.id} id={s.id}>
              <h2 className="text-sm font-semibold text-white mb-3">{s.title}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{s.content}</p>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-900">
          <p className="text-zinc-600 text-xs">
            Iconifika sirve iconos de{' '}
            <a href="https://iconify.design" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
              Iconify
            </a>
            {' '}bajo sus licencias originales. Un proyecto de{' '}
            <a href="https://kitifica.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
              Kitifica
            </a>.
          </p>
        </div>
      </main>
    </div>
  )
}
