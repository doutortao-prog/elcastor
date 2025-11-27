
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, Loader2, Bot, User as UserIcon } from 'lucide-react';
import { Message, User, CatalogType } from '../types';
import { getToolRecommendations } from '../services/geminiService';
import { getCatalogContext } from '../services/catalogData';
import ProductCard from './ProductCard';
import ClarificationForm from './ClarificationForm';

interface ChatInterfaceProps {
  user: User;
  catalogType: CatalogType;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, catalogType }) => {
  const [input, setInput] = useState('');
  
  // Use "Gestor" if name matches default user name or is generic
  const displayName = user.name === 'Gestor Spartan' || user.name === 'Vendedor Spartan' ? 'Gestor' : user.name;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: `Olá, ${displayName}. Sou seu assistente técnico para escolha de ferramentas profissionais.\n\nEstou consultando o catálogo: ${catalogType === 'el_castor' ? 'El Castor' : catalogType === 'unger' ? 'Unger' : 'Completo (El Castor e Unger)'}.\n\nPor favor, descreva a necessidade, o ambiente e o tipo de superfície.`
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Get the context string based on selection
  const catalogContext = getCatalogContext(catalogType);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSend = async (messageText: string = input, audioBase64: string | null = null) => {
    if ((!messageText.trim() && !audioBase64)) return;

    const userMsgId = Date.now().toString();
    const newUserMessage: Message = {
      id: userMsgId,
      role: 'user',
      content: audioBase64 ? 'Mensagem de áudio enviada' : messageText,
      audioUrl: audioBase64 ? 'audio-sent' : undefined
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // Pass the specific catalog context to the service
      const response = await getToolRecommendations(messageText, catalogContext, audioBase64);
      
      const aiMsgId = (Date.now() + 1).toString();
      const newAiMessage: Message = {
        id: aiMsgId,
        role: 'ai',
        content: response.text,
        recommendations: response.recommendations,
        clarificationForm: response.clarificationForm
      };

      setMessages(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormSubmit = (msgId: string, selectedOptions: string[], additionalInfo: string) => {
    setMessages(prev => prev.map(m => 
      m.id === msgId ? { ...m, isFormSubmitted: true } : m
    ));

    let responseText = "RESPOSTA TÉCNICA:\n";
    if (selectedOptions.length > 0) {
      responseText += "Itens selecionados: " + selectedOptions.join('; ') + ".\n";
    }
    if (additionalInfo.trim()) {
      responseText += "Info Complementar: " + additionalInfo;
    }

    handleSend(responseText);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];
          handleSend("", base64Data);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Não foi possível acessar o microfone. Verifique as permissões.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex w-full md:max-w-[85%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-spartan-blue'}`}>
                {msg.role === 'user' ? <UserIcon size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>

              <div className="flex flex-col gap-2 w-full">
                <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none ml-auto' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                
                  {/* Render Clarification Form if present */}
                  {msg.clarificationForm && (
                    <ClarificationForm 
                      form={msg.clarificationForm}
                      onSubmit={(opts, info) => handleFormSubmit(msg.id, opts, info)}
                      disabled={msg.isFormSubmitted}
                    />
                  )}
                </div>

                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {msg.recommendations.map((rec, idx) => (
                      <ProductCard key={idx} product={rec} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex items-center gap-2 text-gray-400 text-sm ml-12">
            <Loader2 size={16} className="animate-spin" />
            <span>Analisando especificações técnicas...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-100">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isProcessing && handleSend()}
              placeholder={isRecording ? "Gravando..." : "Descreva o cenário, temperatura e tipo de sujeira..."}
              className="w-full p-3 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
              disabled={isProcessing || isRecording}
            />
            
            <div className="absolute right-2 top-1.5">
              <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`p-2 rounded-full transition-all ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  title="Usar Voz"
                >
                  {isRecording ? <Square size={18} fill="currentColor" /> : <Mic size={20} />}
                </button>
            </div>
          </div>

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isProcessing || isRecording}
            className="p-3 bg-spartan-blue text-white rounded-full hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shrink-0"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
           A IA pode solicitar mais detalhes através de formulários interativos.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
