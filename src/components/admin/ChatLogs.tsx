import React from 'react';
import { MessageSquare, User, Bot, Calendar, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface ChatLogsProps {
    sessions: any[];
}

export default function ChatLogs({ sessions }: ChatLogsProps) {
    if (sessions.length === 0) {
        return (
            <div className="text-center py-20 bg-[#0c0c16]/30 rounded-[2rem] border border-dashed border-white/5 animate-admin-in">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-[#8888a0] font-medium">No chat conversations recorded yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-admin-in">
            {sessions.map((session) => (
                <div
                    key={session.id}
                    className="bg-[#0c0c16]/50 backdrop-blur-md border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col h-[600px] hover:border-white/10 transition-all p-1"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#ff2d55]">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white">Session Log</h3>
                                    <p className="text-[10px] text-[#8888a0] font-bold uppercase tracking-widest">{session.id.slice(0, 13)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-2 text-white font-bold text-sm">
                                    <Calendar size={14} className="text-[#00c8ff]" />
                                    {new Date(session.created_at).toLocaleDateString()}
                                </div>
                                <p className="text-xs text-[#55556a] mt-1">{new Date(session.created_at).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar-minimal">
                        {session.chat_messages?.length > 0 ? (
                            session.chat_messages.map((msg: any) => (
                                <div
                                    key={msg.id}
                                    className={clsx(
                                        "flex gap-4 max-w-[90%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}
                                >
                                    <div className={clsx(
                                        "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border",
                                        msg.role === 'user' ? "bg-[#00c8ff1a] border-[#00c8ff33] text-[#00c8ff]" : "bg-white/5 border-white/5 text-[#a78bfa]"
                                    )}>
                                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div className={clsx(
                                        "p-4 rounded-3xl text-sm font-medium leading-relaxed",
                                        msg.role === 'user'
                                            ? "bg-[#00c8ff1a] text-white rounded-tr-none border border-[#00c8ff22]"
                                            : "bg-white/5 text-[#d1d1e0] rounded-tl-none border border-white/5"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-[#55556a] text-xs pt-20">Session started but no messages exchanged</p>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="p-6 bg-white/[0.01] border-t border-white/5 text-[10px] text-[#55556a] font-black uppercase tracking-widest text-center">
                        Active Conversation Audit • ID {session.id.slice(-8)}
                    </div>
                </div>
            ))}

            <style jsx global>{`
        .custom-scrollbar-minimal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-minimal::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-minimal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar-minimal::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
        </div>
    );
}
