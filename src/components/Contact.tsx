import { Send } from 'lucide-react'
import { useState } from 'react'

type InterestType = 'comprar' | 'alugar' | 'outro'

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interest: 'comprar' as InterestType,
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Mensagem enviada! Entraremos em contato em breve.')
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      interest: 'comprar',
      message: '',
    })
  }

  const inputClass =
    'w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 outline-none transition-all bg-white text-gray-700'

  return (
    <section id="contato" className="py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Fale conosco</h2>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs font-medium text-gray-600 mb-1">
                  Nome
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-medium text-gray-600 mb-1">
                  Sobrenome
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Quer:</p>
              <div className="flex flex-wrap gap-5 text-sm">
                {([
                  { value: 'comprar', label: 'Comprar' },
                  { value: 'alugar', label: 'Alugar' },
                  { value: 'outro', label: 'Outro' },
                ] as const).map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 text-gray-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="interest"
                      value={option.value}
                      checked={formData.interest === option.value}
                      onChange={() => setFormData({ ...formData, interest: option.value })}
                      className="w-3.5 h-3.5 accent-brand-blue"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-medium text-gray-600 mb-1">
                Mensagem
              </label>
              <textarea
                id="message"
                required
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white py-2.5 rounded-lg text-sm font-semibold transition-all"
            >
              <Send className="w-4 h-4" />
              Enviar
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
