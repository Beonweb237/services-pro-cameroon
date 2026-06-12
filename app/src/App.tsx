import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import SearchPage from '@/pages/Search';
import ProDetail from '@/pages/ProDetail';

import FamiliesPage from '@/pages/FamiliesPage';
import VillesPage from '@/pages/VillesPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import CommentCaMarchePage from '@/pages/CommentCaMarchePage';
import TarifsPage from '@/pages/TarifsPage';
import FAQPage from '@/pages/FAQPage';

import ClientLayout from '@/layouts/ClientLayout';
import ProLayout from '@/layouts/ProLayout';
import AdminLayout from '@/layouts/AdminLayout';

import ClientDashboard from '@/pages/dashboard/ClientDashboard';
import ProDashboard from '@/pages/dashboard/ProDashboard';
import ProAvailability from '@/pages/dashboard/ProAvailability';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import PlaceholderPage from '@/pages/dashboard/PlaceholderPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inscription/client" element={<Register />} />
        <Route path="/inscription/pro" element={<Register />} />
        <Route path="/trouver" element={<SearchPage />} />
        <Route path="/trouver/:categorie" element={<SearchPage />} />
        <Route path="/trouver/:categorie/:ville" element={<SearchPage />} />
        <Route path="/pro/:slug" element={<ProDetail />} />
        <Route path="/familles" element={<FamiliesPage />} />
        <Route path="/villes" element={<VillesPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/comment-ca-marche" element={<CommentCaMarchePage />} />
        <Route path="/tarifs" element={<TarifsPage />} />
        <Route path="/faq" element={<FAQPage />} />

        {/* Client */}
        <Route path="/client" element={<ClientLayout />}>
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="messages" element={<PlaceholderPage title="Messagerie" description="Vos conversations avec les professionnels." />} />
          <Route path="messages/:id" element={<PlaceholderPage title="Conversation" description="Échangez avec votre professionnel." />} />
          <Route path="missions" element={<PlaceholderPage title="Mes missions" description="Historique de toutes vos missions." />} />
          <Route path="favoris" element={<PlaceholderPage title="Favoris" description="Vos professionnels sauvegardés." />} />
          <Route path="avis" element={<PlaceholderPage title="Mes avis" description="Avis à déposer et avis déposés." />} />
          <Route path="parametres" element={<PlaceholderPage title="Paramètres" description="Gérez votre compte client." />} />
        </Route>

        {/* Pro */}
        <Route path="/pro" element={<ProLayout />}>
          <Route path="dashboard" element={<ProDashboard />} />
          <Route path="messages" element={<PlaceholderPage title="Messages" description="Vos conversations avec les clients." />} />
          <Route path="profil" element={<PlaceholderPage title="Mon profil" description="Éditez votre profil professionnel." />} />
          <Route path="disponibilites" element={<ProAvailability />} />
          <Route path="missions" element={<PlaceholderPage title="Missions" description="Gérez vos missions en cours." />} />
          <Route path="avis" element={<PlaceholderPage title="Avis reçus" description="Les avis de vos clients." />} />
          <Route path="statistiques" element={<PlaceholderPage title="Statistiques" description="Analysez votre performance." />} />
          <Route path="documents" element={<PlaceholderPage title="Documents" description="Vos diplômes et certifications." />} />
          <Route path="boost" element={<PlaceholderPage title="Boost" description="Augmentez votre visibilité." />} />
          <Route path="parametres" element={<PlaceholderPage title="Paramètres" description="Gérez votre compte pro." />} />
        </Route>

        {/* Admin / Moderator / Support */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="validation" element={<PlaceholderPage title="Validation des profils" description="Validez ou refusez les nouveaux profils pros." />} />
          <Route path="moderation" element={<PlaceholderPage title="Modération" description="Signalements et contenu à modérer." />} />
          <Route path="utilisateurs" element={<PlaceholderPage title="Utilisateurs" description="Gérez tous les utilisateurs." />} />
          <Route path="analytics" element={<PlaceholderPage title="Analytics" description="Statistiques de la plateforme." />} />
          <Route path="support" element={<PlaceholderPage title="Support" description="Tickets de support." />} />
          <Route path="config" element={<PlaceholderPage title="Configuration" description="Paramètres de la plateforme." />} />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
