"use client";

import { useState } from 'react';
import { X, Mail, MessageCircle, HelpCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const faqs = [
  {
    question: "¿Cómo genero un formulario 08?",
    answer: "Selecciona el tipo de vehículo (Auto o Moto), completa los datos del vendedor, comprador, vehículo y operación, y presiona 'Generar Formulario'."
  },
  {
    question: "¿Dónde encuentro mis trámites guardados?",
    answer: "Ve a 'Historial' en el menú superior para ver todos tus trámites finalizados y borradores."
  },
  {
    question: "¿Cómo uso el autocompletado de personas?",
    answer: "Al cargar un vendedor o comprador, busca por DNI, CUIT o nombre. Si la persona ya fue cargada antes, todos sus datos se completarán automáticamente."
  },
  {
    question: "¿Qué es un borrador?",
    answer: "Un borrador es un trámite guardado que aún no está finalizado. Puedes editarlo y completarlo más tarde."
  }
];

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-4 top-[5%] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-auto md:w-full md:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl md:rounded-3xl shadow-2xl z-[101]"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 md:px-8 py-5 md:py-6 rounded-t-2xl md:rounded-t-3xl flex items-center justify-between z-10">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-mint/10 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="text-brand-mint" size={18} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-black text-gray-900">Centro de Soporte</h2>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">Estamos aquí para ayudarte</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all flex-shrink-0"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 md:p-8 space-y-6 md:space-y-8">
              {/* Contact Options */}
              <div>
                <h3 className="text-[9px] md:text-xs font-black text-gray-500 uppercase tracking-[0.15em] mb-3 md:mb-4">
                  Contacto Directo
                </h3>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  <a
                    href="mailto:somos.env@gmail.com"
                    className="group flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl border-2 border-gray-100 hover:border-brand-mint/50 hover:bg-brand-mint/5 transition-all active:scale-95"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 group-hover:bg-brand-mint/10 rounded-xl flex items-center justify-center transition-all flex-shrink-0">
                      <Mail className="text-gray-400 group-hover:text-brand-mint transition-colors" size={18} strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900 mb-0.5 md:mb-1">Email</div>
                      <div className="text-xs text-gray-500 font-medium truncate">somos.env@gmail.com</div>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/543435086453"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl border-2 border-gray-100 hover:border-green-500/50 hover:bg-green-50/50 transition-all active:scale-95"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 group-hover:bg-green-50 rounded-xl flex items-center justify-center transition-all flex-shrink-0">
                      <MessageCircle className="text-gray-400 group-hover:text-green-500 transition-colors" size={18} strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900 mb-0.5 md:mb-1">WhatsApp</div>
                      <div className="text-xs text-gray-500 font-medium">+54 343 508 6453</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* FAQs */}
              <div>
                <h3 className="text-[9px] md:text-xs font-black text-gray-500 uppercase tracking-[0.15em] mb-3 md:mb-4">
                  Preguntas Frecuentes
                </h3>
                <div className="space-y-2 md:space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setSelectedFAQ(selectedFAQ === index ? null : index)}
                        className="w-full px-4 md:px-5 py-3 md:py-4 text-left flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      >
                        <span className="text-xs md:text-sm font-bold text-gray-900 pr-3">{faq.question}</span>
                        <CheckCircle
                          className={`transition-all flex-shrink-0 ${
                            selectedFAQ === index ? 'text-brand-mint rotate-180' : 'text-gray-300'
                          }`}
                          size={16}
                          strokeWidth={2}
                        />
                      </button>
                      <AnimatePresence>
                        {selectedFAQ === index && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 md:px-5 pb-3 md:pb-4 pt-2 text-xs md:text-sm text-gray-600 font-medium leading-relaxed border-t border-gray-50">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Message */}
              <div className="bg-brand-mint/5 rounded-xl p-4 md:p-6 border-l-4 border-brand-mint">
                <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">
                  <span className="font-bold text-brand-mint">Horario de atención:</span> Lunes a Viernes de 9:00 a 18:00 hs. 
                  Te responderemos lo antes posible.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
