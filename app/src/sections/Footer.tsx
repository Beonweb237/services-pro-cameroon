import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';

const footerLinks = {
  'Pour les Clients': [
    { label: 'Rechercher un pro', href: '/trouver' },
    { label: 'Comment ça marche', href: '/comment-ca-marche' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Nous contacter', href: '/contact' },
  ],
  'Pour les Pros': [
    { label: "S'inscrire", href: '/inscription/pro' },
    { label: 'Les plans tarifaires', href: '/tarifs' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Guide du pro', href: '/guide-pro' },
  ],
  'Légal': [
    { label: 'CGU', href: '/cgu' },
    { label: 'Confidentialité', href: '/confidentialite' },
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'Charte pro', href: '/charte-pro' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative card-bg border-t border-theme">
      <div className="container-max pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-bold text-pri">
                Services <span className="gold-text-gradient">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-ter mb-4 leading-relaxed">
              La plateforme de référence pour trouver des professionnels vérifiés au Cameroun.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: MessageCircle, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-ter hover:text-gold transition-all"
                  style={{ backgroundColor: 'var(--gold-dim)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--border-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--gold-dim)')}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-pri mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-ter hover:text-sec transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-theme pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ter">
            &copy; 2026 Services Pro Cameroon. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
