import { useState } from 'react'
import type { FormEvent } from 'react'

interface SkinQuizProps {
  onSubmit: (result: { summary: string; routine: string[] }) => void
  onCancel: () => void
}

const skinTypes = ['Grasa', 'Seca', 'Mixta']
const concerns = ['Granitos', 'Rojeces', 'Deshidratación', 'Piel opaca', 'Poros dilatados', 'Sensibilidad']

export default function SkinQuiz({ onSubmit, onCancel }: SkinQuizProps) {
  const [age, setAge] = useState('')
  const [skinType, setSkinType] = useState(skinTypes[0])
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([])

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((current) =>
      current.includes(concern) ? current.filter((item) => item !== concern) : [...current, concern]
    )
  }

  const buildRoutine = () => {
    const routine: string[] = []
    const summaryParts: string[] = []

    summaryParts.push(`Edad: ${age || 'No indicada'}`)
    summaryParts.push(`Tipo de piel: ${skinType}`)
    summaryParts.push(`Preocupaciones: ${selectedConcerns.length ? selectedConcerns.join(', ') : 'Ninguna'}`)

    if (skinType === 'Grasa') {
      routine.push('Limpiador en gel suave para controlar el exceso de grasa')
      routine.push('Tónico equilibrante sin alcohol')
      routine.push('Sérum ligero con niacinamida')
    }

    if (skinType === 'Seca') {
      routine.push('Limpiador cremoso e hidratante')
      routine.push('Tónico humectante con ingredientes calmantes')
      routine.push('Sérum con ácido hialurónico')
    }

    if (skinType === 'Mixta') {
      routine.push('Limpiador equilibrante que no reseque')
      routine.push('Tónico suave para zonas secas y mixtas')
      routine.push('Sérum ligero que aporte hidratación sin brillo')
    }

    if (selectedConcerns.includes('Granitos')) {
      routine.push('Tratamiento localizado con ácido salicílico')
    }
    if (selectedConcerns.includes('Rojeces')) {
      routine.push('Sérum calmante con centella asiática')
    }
    if (selectedConcerns.includes('Deshidratación')) {
      routine.push('Mascarilla hidratante semanal')
    }
    if (selectedConcerns.includes('Piel opaca')) {
      routine.push('Exfoliante suave una vez por semana')
    }
    if (selectedConcerns.includes('Poros dilatados')) {
      routine.push('Tónico con niacinamida y control de poros')
    }
    if (selectedConcerns.includes('Sensibilidad')) {
      routine.push('Protección solar mineral suave')
    }

    if (!routine.length) {
      routine.push('Limpieza suave diaria')
      routine.push('Tónico calmante e hidratante')
      routine.push('Protección solar cada mañana')
    }

    return {
      summary: summaryParts.join(' · '),
      routine,
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(buildRoutine())
  }

  return (
    <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Algoritmo de Recomendación</h3>
          <p className="text-sm text-gray-600">Completa este test para recibir una rutina personalizada.</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Cerrar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Edad</label>
          <input
            type="number"
            min={12}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
            placeholder="Ej. 28"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de piel</label>
          <select
            value={skinType}
            onChange={(e) => setSkinType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
          >
            {skinTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">¿Qué te preocupa?</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {concerns.map((concern) => (
              <button
                key={concern}
                type="button"
                onClick={() => toggleConcern(concern)}
                className={`rounded-lg border px-3 py-2 text-sm text-left transition ${
                  selectedConcerns.includes(concern)
                    ? 'border-green-600 bg-green-100 text-green-900'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-green-500'
                }`}
              >
                {concern}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="submit"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Generar rutina
          </button>
        </div>
      </form>
    </div>
  )
}
