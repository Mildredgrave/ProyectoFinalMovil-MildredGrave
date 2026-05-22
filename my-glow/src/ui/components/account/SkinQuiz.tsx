import { useState } from 'react'
import type { FormEvent } from 'react'

interface SkinQuizProps {
  onSubmit: (result: { summary: string; routine: string[] }) => void
  onCancel: () => void
  onAddRecommendedProducts: (routine: string[]) => void
  onGoToCart: () => void
}

const skinTypes = ['Grasa', 'Seca', 'Mixta']
const concerns = ['Granitos', 'Rojeces', 'Deshidratación', 'Piel opaca', 'Poros dilatados', 'Sensibilidad']

function buildRecommendation(age: number | null, skinType: string, selectedConcerns: string[]) {
  const scores = {
    hydration: 0,
    oilControl: 0,
    soothing: 0,
    exfoliation: 0,
    antiAging: 0,
  }

  if (skinType === 'Grasa') {
    scores.oilControl += 3
    scores.exfoliation += 1
  }
  if (skinType === 'Seca') {
    scores.hydration += 3
    scores.soothing += 1
  }
  if (skinType === 'Mixta') {
    scores.oilControl += 1
    scores.hydration += 1
  }

  selectedConcerns.forEach((concern) => {
    if (concern === 'Granitos') {
      scores.oilControl += 2
      scores.exfoliation += 2
    }
    if (concern === 'Rojeces') {
      scores.soothing += 3
    }
    if (concern === 'Deshidratación') {
      scores.hydration += 3
    }
    if (concern === 'Piel opaca') {
      scores.exfoliation += 2
      scores.antiAging += 1
    }
    if (concern === 'Poros dilatados') {
      scores.oilControl += 2
      scores.exfoliation += 1
    }
    if (concern === 'Sensibilidad') {
      scores.soothing += 3
    }
  })

  if (age !== null) {
    if (age >= 30) {
      scores.antiAging += 2
    }
    if (age >= 40) {
      scores.antiAging += 1
      scores.soothing += 1
    }
  }

  const routine: string[] = []
  const summaryParts = [
    `Edad: ${age !== null ? age : 'No indicada'}`,
    `Tipo de piel: ${skinType}`,
    `Preocupaciones: ${selectedConcerns.length ? selectedConcerns.join(', ') : 'Ninguna'}`,
  ]

  if (scores.oilControl >= 3) {
    routine.push('Limpiador en gel suave o espuma ligera para controlar el exceso de grasa')
    routine.push('Tónico equilibrante con niacinamida')
  }
  if (scores.hydration >= 3) {
    routine.push('Limpiador cremoso suave que mantenga la barrera hidratada')
    routine.push('Sérum de ácido hialurónico para retener humedad')
  }
  if (scores.oilControl < 3 && scores.hydration < 3) {
    routine.push('Limpiador equilibrante que respete tu piel')
    routine.push('Tónico suave con ingredientes hidratantes')
  }

  if (scores.soothing >= 3) {
    routine.push('Sérum calmante con centella asiática o alantoína')
  }
  if (scores.exfoliation >= 2) {
    routine.push('Exfoliante químico suave con AHA/BHA una o dos veces por semana')
  }
  if (scores.antiAging >= 2) {
    routine.push('Sérum antioxidante con vitamina C por la mañana')
    routine.push('Rutina nocturna con péptidos o bakuchiol')
  }
  if (selectedConcerns.includes('Granitos')) {
    routine.push('Tratamiento localizado con ácido salicílico o peróxido de benzoilo')
  }
  if (selectedConcerns.includes('Rojeces')) {
    routine.push('Crema o sérum antirojeces con niacinamida y ceramidas')
  }
  if (selectedConcerns.includes('Sensibilidad')) {
    routine.push('Protector solar mineral SPF 50+ y sin fragancias')
  }

  routine.push('Protector solar todos los días como paso final de la mañana')

  const uniqueRoutine = Array.from(new Set(routine))
  return {
    summary: summaryParts.join(' · '),
    routine: uniqueRoutine,
  }
}

export default function SkinQuiz({ onSubmit, onCancel, onAddRecommendedProducts, onGoToCart }: SkinQuizProps) {
  const [age, setAge] = useState('')
  const [skinType, setSkinType] = useState(skinTypes[0])
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([])
  const [generatedResult, setGeneratedResult] = useState<{ summary: string; routine: string[] } | null>(null)

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((current) =>
      current.includes(concern) ? current.filter((item) => item !== concern) : [...current, concern]
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const ageNumber = age ? Number(age) : null
    const result = buildRecommendation(ageNumber, skinType, selectedConcerns)
    setGeneratedResult(result)
    onSubmit(result)
  }

  const handleEdit = () => {
    setGeneratedResult(null)
  }

  return (
    <div className="w-full max-w-full overflow-hidden rounded-[32px] bg-gradient-to-br from-[#f5fff8] via-white to-[#e7f7ff] shadow-xl shadow-slate-200">
      <div className="max-h-[80vh] min-h-[0] overflow-y-auto">
      <div className="border-b border-slate-200 px-5 py-5 bg-white/80 backdrop-blur-sm sm:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-green-600">Algoritmo de Recomendación</p>
            <h3 className="text-2xl font-semibold text-slate-900">Encuentra la rutina ideal para tu piel</h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Responde el test y recibe una rutina actualizada basada en tipo de piel, preocupaciones y edad.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 px-5 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl bg-slate-950/5 p-5 shadow-inner shadow-slate-100">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Perfil</p>
            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <label className="mb-2 block font-medium text-slate-800">Edad</label>
                <input
                  type="number"
                  min={12}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Ej. 28"
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-slate-800">Tipo de piel</label>
                <select
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value)}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  {skinTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950/5 p-5 shadow-inner shadow-slate-100">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Preocupaciones</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {concerns.map((concern) => (
                <button
                  key={concern}
                  type="button"
                  onClick={() => toggleConcern(concern)}
                  className={`rounded-3xl border px-4 py-3 text-left text-sm transition duration-200 ${
                    selectedConcerns.includes(concern)
                      ? 'border-green-600 bg-emerald-50 text-slate-900 shadow-sm'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-green-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="block font-semibold">{concern}</span>
                  <span className="mt-1 block text-xs text-slate-500">Selecciona para personalizar la rutina</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {generatedResult ? (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-base font-semibold text-slate-900">Tu recomendación</h4>
                  <p className="text-sm text-slate-600">El algoritmo adapta cada paso en función de los datos que ingreses.</p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Personalizado
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Limpieza</p>
                  <p className="mt-2 text-sm text-slate-700">Selecciona un limpiador que respete tu tipo de piel y reduzca el exceso de sebo sin resecar.</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tratamientos</p>
                  <p className="mt-2 text-sm text-slate-700">Incluye sérums y activos específicos según tus preocupaciones principales.</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Protección</p>
                  <p className="mt-2 text-sm text-slate-700">El bloqueador solar siempre se recomienda como paso clave de mañana.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <h4 className="text-base font-semibold text-slate-900">Resumen</h4>
              <p className="text-sm leading-7 text-slate-700">{generatedResult.summary}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {generatedResult.routine.map((step, index) => (
                  <div key={index} className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="mb-2 text-sm font-semibold text-slate-900">Paso {index + 1}</p>
                    <p className="text-sm leading-6 text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => generatedResult && onAddRecommendedProducts(generatedResult.routine)}
                className="rounded-full border border-green-600 bg-white px-6 py-3 text-sm font-semibold text-green-700 transition hover:border-green-700 hover:bg-emerald-50"
              >
                Agregar productos recomendados al carrito
              </button>
              <button
                type="button"
                onClick={onGoToCart}
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Ir al carrito
              </button>
              <button
                type="button"
                onClick={handleEdit}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Editar respuestas
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:from-emerald-700 hover:to-green-600"
              >
                Ver mi rutina personalizada
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Volver
              </button>
            </div>
          </>
        )}
      </form>
      </div>
    </div>
  )
}
