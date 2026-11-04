import React, { useState } from 'react';
import { ChevronDown, Plus, Trash2, HelpCircle, Check, MessageSquare } from 'lucide-react';
import { useShopStore } from '../store/shopStore.jsx';

export default function FaqAccordion() {
  const { lang, t, faqs, addFaq, deleteFaq } = useShopStore();
  const [openId, setOpenId] = useState(faqs[0]?.id || null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setError(
        lang === 'mm'
          ? 'မေးခွန်းနှင့် အဖြေ နှစ်ခုစလုံး ဖြည့်သွင်းရန် လိုအပ်ပါသည်'
          : 'Both question and answer are required'
      );
      return;
    }

    addFaq({
      question,
      answer,
    });

    setQuestion('');
    setAnswer('');
    setError('');
    setShowAddForm(false);
    setSuccessToast(t.botFaq.faqCreated);
    setTimeout(() => setSuccessToast(''), 2500);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteFaq(id);
    setSuccessToast(t.botFaq.faqDeleted);
    setTimeout(() => setSuccessToast(''), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D2A45] text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold border border-[#A8E6CF]/40 animate-fade-in">
          <Check className="w-4 h-4 text-[#A8E6CF]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-[#2D2A45] text-base sm:text-lg font-display flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#7857ED]" />
            {t.botFaq.faqHeading}
          </h3>
          <p className="text-xs text-neutral-500 font-medium">
            {t.botFaq.faqSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="cartoon-btn-mint px-4 py-2 text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? t.botFaq.cancelFaq : t.botFaq.addFaqBtn}</span>
        </button>
      </div>

      {/* Add FAQ Form Modal / Expansion */}
      {showAddForm && (
        <form
          onSubmit={handleAddFaq}
          className="cartoon-card p-4 sm:p-5 border-2 border-[#5EB597] bg-[#A8E6CF]/10 space-y-3"
        >
          <h4 className="font-bold text-sm text-[#144735]">
            {t.botFaq.addFaqBtn}
          </h4>

          <div>
            <label className="block text-xs font-bold text-[#2D2A45] mb-1">
              {t.botFaq.questionLabel}
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                lang === 'mm'
                  ? 'ဥပမာ - ရန်ကုန်မြို့တွင်း ပို့ဆောင်ခ ဘယ်လောက်လဲ?'
                  : 'e.g. How much is delivery within Yangon?'
              }
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#2D2A45]/20 text-xs sm:text-sm font-medium outline-hidden focus:border-[#7857ED]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D2A45] mb-1">
              {t.botFaq.answerLabel}
            </label>
            <textarea
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={
                lang === 'mm'
                  ? 'ဘော့မှ အလိုအလျောက် ပေးပို့မည့် အဖြေရေးပါ...'
                  : 'Write automated reply sent by bot...'
              }
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#2D2A45]/20 text-xs sm:text-sm font-medium outline-hidden focus:border-[#7857ED] resize-none"
            />
          </div>

          {error && <p className="text-xs text-rose-600 font-bold">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-white text-[#2D2A45] border border-[#2D2A45]/20 hover:bg-neutral-100 cursor-pointer"
            >
              {t.botFaq.cancelFaq}
            </button>
            <button
              type="submit"
              className="cartoon-btn-primary px-5 py-1.5 text-xs cursor-pointer"
            >
              {t.botFaq.saveFaq}
            </button>
          </div>
        </form>
      )}

      {/* Accordion List */}
      {faqs.length === 0 ? (
        <div className="cartoon-card p-8 text-center text-neutral-500">
          <p className="text-sm">{t.botFaq.noFaqs}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            const q = lang === 'mm' && faq.questionMm ? faq.questionMm : faq.question;
            const a = lang === 'mm' && faq.answerMm ? faq.answerMm : faq.answer;

            return (
              <div
                key={faq.id}
                className="cartoon-card border border-[#2D2A45]/10 overflow-hidden bg-white transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-[#FFF8EC]/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#B9A7F5]/30 text-[#6B4FD8] flex items-center justify-center shrink-0">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-extrabold text-xs sm:text-sm text-[#2D2A45]">
                      {q}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(faq.id, e)}
                      title="Delete FAQ"
                      className="p-1.5 rounded-full text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#7857ED]' : ''
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#2D2A45]/80 bg-[#FFF8EC]/30 border-t border-[#2D2A45]/5 leading-relaxed">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
