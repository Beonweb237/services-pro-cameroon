import { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, AlertCircle } from 'lucide-react';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

const defaultSchedule: Record<string, DaySchedule> = {};
DAY_KEYS.forEach((key, i) => {
  defaultSchedule[key] = {
    enabled: i < 6,
    slots: i < 6 ? [{ id: '1', start: '08:00', end: '17:00' }] : [],
  };
});

const unavailPeriods = [
  { id: '1', start: '2026-06-15', end: '2026-06-20', reason: 'Congés' },
  { id: '2', start: '2026-07-01', end: '2026-07-01', reason: 'Formation' },
];

export default function ProAvailability() {
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [statusMsg, setStatusMsg] = useState('Disponible pour vos projets');

  const toggleDay = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  const addSlot = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], slots: [...prev[day].slots, { id: Date.now().toString(), start: '09:00', end: '17:00' }] },
    }));
  };

  const removeSlot = (day: string, slotId: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], slots: prev[day].slots.filter(s => s.id !== slotId) },
    }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-pri">Mes disponibilités</h1>
        <p className="text-sm text-sec mt-1">Définissez vos horaires hebdomadaires et vos périodes d'indisponibilité.</p>
      </div>

      {/* Status message */}
      <div className="card-bg card-border rounded-xl p-4">
        <label className="text-sm font-medium text-pri mb-2 block flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[var(--gold)]" />Message de statut
        </label>
        <input
          type="text"
          value={statusMsg}
          onChange={(e) => setStatusMsg(e.target.value)}
          className="w-full input-bg card-border rounded-xl px-4 py-2.5 text-sm text-pri outline-none focus:border-[var(--gold)] transition-all"
          placeholder="Ex: Disponible pour vos projets"
        />
        <p className="text-[11px] text-ter mt-1">Ce message est visible sur votre profil public.</p>
      </div>

      {/* Weekly schedule */}
      <div className="card-bg card-border rounded-xl p-5">
        <h2 className="font-semibold text-pri mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-[var(--gold)]" />Horaires hebdomadaires</h2>
        <div className="space-y-4">
          {DAY_KEYS.map((key, i) => {
            const day = schedule[key];
            return (
              <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 rounded-xl bg-[var(--bg-hover)]/20">
                <label className="flex items-center gap-2 shrink-0 w-28 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" checked={day.enabled} onChange={() => toggleDay(key)} className="sr-only peer" />
                    <div className="w-9 h-5 rounded-full bg-[var(--border-color)] peer-checked:bg-[var(--gold)] transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
                  </div>
                  <span className={`text-sm ${day.enabled ? 'text-pri font-medium' : 'text-ter'}`}>{DAYS[i]}</span>
                </label>

                {day.enabled && (
                  <div className="flex-1 flex flex-wrap gap-2">
                    {day.slots.map((slot) => (
                      <div key={slot.id} className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 input-bg card-border rounded-lg px-2 py-1">
                          <Clock className="w-3 h-3 text-ter" />
                          <input type="time" value={slot.start} className="bg-transparent text-xs text-pri outline-none" />
                          <span className="text-ter">-</span>
                          <input type="time" value={slot.end} className="bg-transparent text-xs text-pri outline-none" />
                        </div>
                        <button onClick={() => removeSlot(key, slot.id)} className="p-1 text-ter hover:text-[var(--danger)] transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addSlot(key)} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-[var(--gold)] hover:bg-[var(--gold-dim)] transition-colors">
                      <Plus className="w-3 h-3" />Créneau
                    </button>
                  </div>
                )}
                {!day.enabled && <span className="text-xs text-ter italic">Indisponible</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Unavailability periods */}
      <div className="card-bg card-border rounded-xl p-5">
        <h2 className="font-semibold text-pri mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-[var(--danger)]" />Périodes d'indisponibilité</h2>
        <div className="space-y-2 mb-4">
          {unavailPeriods.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-hover)]/20">
              <div>
                <div className="text-sm text-pri">{new Date(p.start).toLocaleDateString('fr-FR')} {p.start !== p.end && `→ ${new Date(p.end).toLocaleDateString('fr-FR')}`}</div>
                <div className="text-xs text-ter">{p.reason}</div>
              </div>
              <button className="p-1.5 text-ter hover:text-[var(--danger)] transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[var(--gold)] border border-[var(--gold)]/20 hover:bg-[var(--gold-dim)] transition-all">
          <Plus className="w-4 h-4" />Ajouter une période
        </button>
      </div>

      <button className="btn-gold w-full sm:w-auto">Enregistrer les modifications</button>
    </div>
  );
}
