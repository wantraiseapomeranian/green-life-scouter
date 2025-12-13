import { useState } from 'react';
import * as Icons from 'lucide-react';
import GlassCard from '../UI/GlassCard';
import { cn } from '../../utils/cn';

export default function HabitList({ habits, checkedHabits, onToggle }) {
  return (
    <div className="space-y-3">
      {habits.map((habit) => {
        const Icon = Icons[habit.icon];
        const isChecked = checkedHabits[habit.id];

        return (
          <GlassCard
            key={habit.id}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:scale-102",
              isChecked && "bg-emerald-100/60 border-emerald-300"
            )}
            onClick={() => onToggle(habit.id)}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                  isChecked
                    ? "bg-gradient-primary text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    "font-medium transition-all duration-300",
                    isChecked && "text-emerald-700"
                  )}
                >
                  {habit.text}
                </p>
              </div>
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  isChecked
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300"
                )}
              >
                {isChecked && (
                  <Icons.Check className="w-4 h-4 text-white" strokeWidth={3} />
                )}
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
