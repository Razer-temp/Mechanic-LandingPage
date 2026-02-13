import React from 'react';
import { MessageSquare, User, Bot, Calendar, ChevronRight, Hash, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

interface ChatLogsProps {
    sessions: any[];
}

export default function ChatLogs({ sessions }: ChatLogsProps) {
    if (sessions.length === 0) {
        return (
            <div className="text-center py-32 bg-[#10101e] rounded-[2.5rem] border border-dashed border-white/10 animate-admin-in shadow-inner">
                <div className="text-6xl mb-6">💬</div>
                <p className="text-[#eeeef2] text-lg font-bold">No intelligence logs recorded yet.</p>
                <p className="text-[#55556a] mt-2">AI interactions will appear here once users start diagnostic chats.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-admin-in">
            {sessions.map((session) => (
                <div
                    key={session.id}
                    className="bg-[#10101e] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col h-[650px] shadow-2xl hover:border-[#a78bfa]/30 transition-all p-1"
                >
                    {/* Header */}
                    <div className="p-10 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-[#ff2d551a] border border-[#ff2d5533] rounded-2xl flex items-center justify-center text-[#ff2d55] shadow-lg">
                                    <MessageSquare size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white tracking-tight">Intelligence Audit</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Hash size={12} className="text-[#a78bfa]" />
                                        <p className="text-[10px] text-[#8888a0] font-black uppercase tracking-widest">{session.id.slice(0, 16)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <div className="flex items-center gap-2 text-[#eeeef2] font-black text-sm justify-end">
                                    <Calendar size={14} className="text-[#00c8ff]" />
                                    {new Date(session.created_at).toLocaleDateString()}
                                </div>
                                <p className="text-[10px] text-[#55556a] font-black uppercase tracking-widest">{new Date(session.created_at).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar-minimal bg-[#050508]/20 shadow-inner">
                        {session.chat_messages?.length > 0 ? (
                            session.chat_messages.map((msg: any) => (
                                <div
                                    key={msg.id}
                                    className={clsx(
                                        "flex gap-5 max-w-[85%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}
                                >
                                    <div className={clsx(
                                        "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border shadow-lg transition-transform hover:scale-110",
                                        msg.role === 'user'
                                            ? "bg-[#00c8ff1a] border-[#00c8ff33] text-[#00c8ff]"
                                            : "bg-[#a78bfa1a] border-[#a78bfa33] text-[#a78bfa]"
                                    )}>
                                        {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                                    </div>
                                    <div className={clsx(
                                        "p-6 rounded-[1.8rem] text-sm font-bold leading-relaxed shadow-sm",
                                        msg.role === 'user'
                                            ? "bg-[#00c8ff1a] text-white rounded-tr-none border border-[#00c8ff22]"
                                            : "bg-[#10101e] text-[#eeeef2] rounded-tl-none border border-white/5"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                                    <RotateCcw size={20} className="text-[#55556a]" />
                                </div>
                                <p className="text-[#55556a] text-[10px] font-black uppercase tracking-widest">Awaiting Transmission...</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="p-6 bg-white/[0.01] border-t border-white/5 text-[9px] text-[#55556a] font-black uppercase tracking-[0.3em] text-center">
                        Cryptographic Audit Trail • SEC_ID_{session.id.slice(-6).toUpperCase()}
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
