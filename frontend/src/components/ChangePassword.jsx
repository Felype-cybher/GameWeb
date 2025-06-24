import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { KeyRound } from 'lucide-react';

const ChangePassword = ({ onPasswordChanged, onCancel }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({ title: "Erro", description: "As novas senhas não coincidem.", variant: "destructive" });
            return;
        }

        if (newPassword.length < 6) {
            toast({ title: "Erro", description: "A nova senha precisa ter pelo menos 6 caracteres.", variant: "destructive" });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Envia o token para provar ao backend que estamos logados
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Falha ao alterar a senha.');
            }

            toast({ title: "Sucesso!", description: "Sua senha foi alterada." });
            onPasswordChanged(); // Avisa o App.jsx para voltar para a tela principal

        } catch (error) {
            toast({ title: "Erro", description: error.message, variant: "destructive" });
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-center mb-4 flex items-center justify-center">
                <KeyRound className="h-5 w-5 mr-2" />
                Alterar Senha
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="password" placeholder="Senha Atual" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
                <input type="password" placeholder="Nova Senha" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
                <input type="password" placeholder="Confirmar Nova Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
                <div className="flex space-x-2 pt-2">
                    <Button type="button" variant="outline" onClick={onCancel} className="w-full">Cancelar</Button>
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">Salvar Nova Senha</Button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
