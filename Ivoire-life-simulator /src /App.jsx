import React, { useState, useEffect } from 'react';
import { 
  User, MapPin, Briefcase, GraduationCap, Home, Smartphone, 
  Sun, Battery, Heart, Smile, Sparkles, MessageSquare, Image as ImageIcon,
  Zap, DollarSign, BookOpen, Send, ShoppingBag, ShieldAlert, Award, TrendingUp, Bus, Utensils
} from 'lucide-react';

// --- DATA STRUCTURES ---

const COMMUNES = [
  { id: 'anyama', name: 'Anyama', desc: 'Commune calme, réputée pour ses plantations, son marché animé et la nouvelle ligne de train.', rentCoeff: 0.6, transportCost: 300 },
  { id: 'abobo', name: 'Abobo', desc: 'Commune populaire et vivante, idéale pour débuter à petit budget.', rentCoeff: 0.5, transportCost: 200 },
  { id: 'adjame', name: 'Adjamé', desc: 'Le cœur commercial d’Abidjan, gares routières et grands marchés.', rentCoeff: 0.7, transportCost: 250 },
  { id: 'cocody', name: 'Cocody', desc: 'Quartier résidentiel et huppé, ambassades et grandes universités.', rentCoeff: 2.0, transportCost: 500 },
  { id: 'yopougon', name: 'Yopougon', desc: 'La plus grande commune, célèbre pour sa vie nocturne et ses maquis.', rentCoeff: 0.8, transportCost: 300 },
  { id: 'plateau', name: 'Plateau', desc: 'Le centre des affaires et des gratte-ciels administratifs.', rentCoeff: 2.5, transportCost: 400 },
  { id: 'treichville', name: 'Treichville', desc: 'Culture, port et ambiance traditionnelle ivoirienne.', rentCoeff: 1.0, transportCost: 300 },
  { id: 'marcory', name: 'Marcory', desc: 'Zone résidentielle chic avec Zone 4 et commerces modernes.', rentCoeff: 1.8, transportCost: 400 },
  { id: 'koumassi', name: 'Koumassi', desc: 'Zone industrielle et artisanale dynamique.', rentCoeff: 0.8, transportCost: 300 },
  { id: 'port-bouet', name: 'Port-Bouët', desc: 'Bord de mer, aéroport et grande plage d’Abidjan.', rentCoeff: 1.1, transportCost: 400 },
  { id: 'bingerville', name: 'Bingerville', desc: 'Ancienne capitale, verdoyante avec ses écoles célèbres.', rentCoeff: 1.2, transportCost: 450 },
  { id: 'grand-bassam', name: 'Grand-Bassam', desc: 'Ville historique et touristique au bord de l’eau.', rentCoeff: 1.3, transportCost: 600 }
];

const DIPLOMAS = [
  { id: 'cp', name: 'CEPE / Primaires', level: 1, cost: 10000, duration: 5, req: null },
  { id: 'bepc', name: 'BEPC (Collège)', level: 2, cost: 25000, duration: 10, req: 'cp' },
  { id: 'bac', name: 'BAC (Lycée)', level: 3, cost: 50000, duration: 15, req: 'bepc' },
  { id: 'licence', name: 'Licence (Université)', level: 4, cost: 150000, duration: 25, req: 'bac' },
  { id: 'master', name: 'Master (Université)', level: 5, cost: 300000, duration: 40, req: 'licence' }
];

const JOBS = [
  { id: 'gbaka', title: 'Apprenti Gbaka', salary: 35000, reqDiploma: null, commune: 'adjame', expNeeded: 0 },
  { id: 'garba', title: 'Vendeur de Garba', salary: 45000, reqDiploma: 'cp', commune: 'yopougon', expNeeded: 0 },
  { id: 'gerant_maquis', title: 'Gérant de Maquis', salary: 90000, reqDiploma: 'bepc', commune: 'yopougon', expNeeded: 10 },
  { id: 'informaticien', title: 'Développeur Web', salary: 250000, reqDiploma: 'bac', commune: 'cocody', expNeeded: 20 },
  { id: 'banquier', title: 'Analyste Financier', salary: 500000, reqDiploma: 'licence', commune: 'plateau', expNeeded: 35 },
  { id: 'avocat', title: 'Avocat d’Affaires', salary: 850000, reqDiploma: 'master', commune: 'plateau', expNeeded: 50 },
  { id: 'medecin', title: 'Médecin Généraliste', salary: 950000, reqDiploma: 'master', commune: 'cocody', expNeeded: 60 }
];

const HOUSING_TYPES = [
  { id: 'cour_commune', name: 'Entrée-Couché (Cour Commune)', rent: 25000, deposit: 75000, kwhBase: 20, desc: 'Chambre simple avec douches communes. Ambiance chaleureuse mais bruyante.' },
  { id: 'studio', name: 'Studio Américain Moderne', rent: 65000, deposit: 195000, kwhBase: 50, desc: 'Espace autonome idéal pour jeunes travailleurs, avec cuisine ouverte.' },
  { id: 'appartement', name: 'Appartement 3 Pièces', rent: 180000, deposit: 540000, kwhBase: 120, desc: 'Grand salon, 2 chambres, balcon et parking dans un quartier calme.' },
  { id: 'duplex', name: 'Villa Duplex avec Piscine', rent: 650000, deposit: 1950000, kwhBase: 300, desc: 'Le haut standing ivoirien. Sécurité 24h/24 et confort total.' }
];

export default function App() {
  // --- PLAYER STATE ---
  const [character, setCharacter] = useState({
    name: 'Kouassi Jean',
    gender: 'M',
    skinColor: '#8d5524',
    hairstyle: 'Afro Courte',
    outfit: 'Tenue Traditionnelle Wax',
    created: false
  });

  const [stats, setStats] = useState({
    energy: 90,
    hunger: 80,
    health: 95,
    morale: 85,
    money: 125000,
    exp: 0
  });

  const [education, setEducation] = useState({
    currentDiploma: null,
    obtainedDiplomas: [],
    studyingFor: null,
    studyProgress: 0
  });

  const [location, setLocation] = useState('anyama');
  const [currentJob, setCurrentJob] = useState(null);

  // Housing state
  const [housing, setHousing] = useState({
    type: HOUSING_TYPES[0],
    commune: 'abobo',
    electricityKwh: 35,
    hasGenerator: false,
    generatorActive: false,
    outage: false
  });

  // Phone & Social state
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, map, edu, job, home, phone
  const [phoneTab, setPhoneTab] = useState('chat_public'); // chat_public, chat_private, wallet
  
  const [publicChats, setPublicChats] = useState([
    { id: 1, sender: 'Awa_Cocody', text: 'Salut tout le monde ! Quelqu’un sait si le Garba d’Anyama est ouvert ?', commune: 'anyama', time: '14:20' },
    { id: 2, sender: 'Yaya_Chauffeur', text: 'Embouteillage grave sur l’autoroute du Nord ce soir ! Attention aux Gbaka.', commune: 'adjame', time: '14:25' },
    { id: 3, sender: 'Koffi_Pro', text: 'On cherche un stagiaire Master à Plateau. Envoyez un MP !', commune: 'plateau', time: '14:32' }
  ]);

  const [newPublicMsg, setNewPublicMsg] = useState('');

  const [privateChats, setPrivateChats] = useState([
    {
      contact: 'Aya De Cocody',
      online: true,
      messages: [
        { sender: 'Aya', text: 'Coucou ! Tu viens au Maquis ce soir ?', type: 'text' },
        { sender: 'You', text: 'Oui j’arrive dès que j’ai payé ma recharge Woyofal !', type: 'text' }
      ]
    }
  ]);
  const [activeContact, setActiveContact] = useState(0);
  const [newPrivateMsg, setNewPrivateMsg] = useState('');

  // Simulation effect (decay stats over time, electricity outage)
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        energy: Math.max(0, prev.energy - 1),
        hunger: Math.max(0, prev.hunger - 2),
        morale: prev.hunger < 20 ? Math.max(0, prev.morale - 2) : prev.morale
      }));

      // Random power outage (5% chance every cycle)
      if (Math.random() < 0.05) {
        setHousing(prev => ({ ...prev, outage: true }));
      }
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handleCreateChar = () => {
    if (character.name.trim() !== '') {
      setCharacter(prev => ({ ...prev, created: true }));
    }
  };

  const handleStudy = (diploma) => {
    if (stats.money < diploma.cost) return alert("Vous n'avez pas assez d'argent !");
    setStats(prev => ({ ...prev, money: prev.money - diploma.cost }));
    setEducation(prev => ({
      ...prev,
      studyingFor: diploma,
      studyProgress: 0
    }));
  };

  const advanceStudy = () => {
    if (!education.studyingFor) return;
    const nextProg = education.studyProgress + 25;
    if (nextProg >= 100) {
      setEducation(prev => ({
        ...prev,
        currentDiploma: prev.studyingFor.id,
        obtainedDiplomas: [...prev.obtainedDiplomas, prev.studyingFor.id],
        studyingFor: null,
        studyProgress: 0
      }));
      setStats(prev => ({ ...prev, exp: prev.exp + 15, morale: Math.min(100, prev.morale + 20) }));
      alert(`Félicitations ! Vous avez obtenu le diplôme : ${education.studyingFor.name}`);
    } else {
      setEducation(prev => ({ ...prev, studyProgress: nextProg }));
      setStats(prev => ({ ...prev, energy: Math.max(0, prev.energy - 15) }));
    }
  };

  const handleSendPublicMsg = () => {
    if (!newPublicMsg.trim()) return;
    const msg = {
      id: Date.now(),
      sender: character.name,
      text: newPublicMsg,
      commune: location,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setPublicChats([...publicChats, msg]);
    setNewPublicMsg('');
  };

  const handleSendPrivateMsg = (type = 'text', content = null) => {
    const textToSend = content || newPrivateMsg;
    if (!textToSend.trim() && type === 'text') return;

    const updatedChats = [...privateChats];
    updatedChats[activeContact].messages.push({
      sender: 'You',
      text: textToSend,
      type: type
    });

    setPrivateChats(updatedChats);
    if (type === 'text') setNewPrivateMsg('');
  };

  const handleSendPhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=60'
    ];
    const randomPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    handleSendPrivateMsg('image', randomPhoto);
  };

  const buyKwh = (amount, cost) => {
    if (stats.money < cost) return alert("Fonds insuffisants !");
    setStats(prev => ({ ...prev, money: prev.money - cost }));
    setHousing(prev => ({ ...prev, electricityKwh: prev.electricityKwh + amount }));
  };

  const cookMeal = (cost, energyGain, hungerGain) => {
    if (stats.money < cost) return alert("Pas assez de sous pour les condiments !");
    setStats(prev => ({
      ...prev,
      money: prev.money - cost,
      hunger: Math.min(100, prev.hunger + hungerGain),
      energy: Math.min(100, prev.energy + energyGain)
    }));
  };

  // Avatar Creation View
  if (!character.created) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-orange-500">Ivoire Life Simulator</h1>
            <p className="text-slate-400 text-sm mt-1">Créez votre personnage 3D réaliste à Abidjan</p>
          </div>

          {/* Realistic 3D Avatar Preview Box */}
          <div className="relative w-48 h-56 mx-auto bg-gradient-to-b from-slate-700 to-slate-900 rounded-2xl flex flex-col items-center justify-center border-2 border-orange-500 shadow-inner overflow-hidden mb-6">
            <div 
              className="w-24 h-24 rounded-full border-4 border-slate-600 shadow-xl transition-all duration-300 relative"
              style={{ backgroundColor: character.skinColor }}
            >
              {/* Hairstyle rendering */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-slate-900 px-2 py-0.5 rounded-full text-orange-400 font-bold border border-slate-700">
                {character.hairstyle}
              </div>
              {/* Face details */}
              <div className="flex justify-between px-4 pt-8">
                <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
                <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
              </div>
              <div className="w-6 h-1.5 bg-slate-900/60 rounded-full mx-auto mt-4"></div>
            </div>
            <div className="mt-4 px-3 py-1 bg-orange-600/30 text-orange-300 text-xs rounded-full border border-orange-500/30">
              {character.outfit}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400">Prénom & Nom</label>
              <input 
                type="text" 
                value={character.name}
                onChange={(e) => setCharacter({...character, name: e.target.value})}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400">Teint de peau</label>
              <div className="flex gap-2 mt-1">
                {['#8d5524', '#c68642', '#e0ac69', '#3c2211'].map(color => (
                  <button 
                    key={color}
                    onClick={() => setCharacter({...character, skinColor: color})}
                    className={`w-8 h-8 rounded-full border-2 ${character.skinColor === color ? 'border-orange-500 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400">Coiffure</label>
              <select 
                value={character.hairstyle}
                onChange={(e) => setCharacter({...character, hairstyle: e.target.value})}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
              >
                <option>Afro Courte</option>
                <option>Tresses / Nattes</option>
                <option>Locks Stylisées</option>
                <option>Dégradé Propre</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400">Style Vestimentaire</label>
              <select 
                value={character.outfit}
                onChange={(e) => setCharacter({...character, outfit: e.target.value})}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
              >
                <option>Tenue Traditionnelle Wax</option>
                <option>Costume Pro / Chemise</option>
                <option>Streetwear Abidjanais</option>
                <option>Décontracté Chic</option>
              </select>
            </div>

            <button 
              onClick={handleCreateChar}
              className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold py-3 rounded-xl hover:opacity-90 shadow-lg"
            >
              Commencer sa vie à Abidjan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-orange-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-orange-500 leading-tight">Ivoire Life</h1>
              <p className="text-xs text-slate-400">Abidjan Simulator</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Mon Profil & Statut', icon: User },
              { id: 'home', label: 'Mon Logement & CIE', icon: Home },
              { id: 'edu', label: 'Éducation & Diplômes', icon: GraduationCap },
              { id: 'job', label: 'Métiers & Emplois', icon: Briefcase },
              { id: 'map', label: 'Carte d’Abidjan (12)', icon: MapPin },
              { id: 'phone', label: 'IvoirePhone', icon: Smartphone }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    activeTab === item.id 
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM HUD / QUICK STATS */}
        <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Argent liquide:</span>
            <span className="font-bold text-emerald-400">{stats.money.toLocaleString()} FCFA</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-400" /> Énergie</span>
              <span>{stats.energy}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full" style={{ width: `${stats.energy}%` }}></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1"><Utensils className="w-3 h-3 text-orange-400" /> Faim</span>
              <span>{stats.hunger}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full" style={{ width: `${stats.hunger}%` }}></div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-full border-2 border-orange-500 flex items-center justify-center font-bold text-xl shadow-lg"
                  style={{ backgroundColor: character.skinColor }}
                >
                  {character.name[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{character.name}</h2>
                  <p className="text-sm text-slate-400">Commune actuelle : <span className="text-orange-400 capitalize">{location}</span></p>
                  <p className="text-xs text-slate-500">Style: {character.outfit} • Hair: {character.hairstyle}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full font-semibold border border-orange-500/30">
                  {currentJob ? currentJob.title : 'Sans Emploi'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                  <DollarSign className="w-5 h-5" />
                  <h3 className="font-semibold text-white">Portefeuille Mobile</h3>
                </div>
                <p className="text-2xl font-extrabold">{stats.money.toLocaleString()} FCFA</p>
                <p className="text-xs text-slate-400 mt-1">Disponibles sur Wave / Orange Money</p>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3 text-amber-400 mb-2">
                  <Award className="w-5 h-5" />
                  <h3 className="font-semibold text-white">Niveau d’Éducation</h3>
                </div>
                <p className="text-lg font-bold">
                  {education.currentDiploma 
                    ? DIPLOMAS.find(d => d.id === education.currentDiploma)?.name 
                    : 'Aucun Diplôme'}
                </p>
                <p className="text-xs text-slate-400 mt-1">{education.obtainedDiplomas.length} diplômes validés</p>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3 text-blue-400 mb-2">
                  <Home className="w-5 h-5" />
                  <h3 className="font-semibold text-white">Résidence</h3>
                </div>
                <p className="text-lg font-bold">{housing.type.name}</p>
                <p className="text-xs text-slate-400 mt-1">Électricité: {housing.electricityKwh} kWh restants</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HOUSING & REALISM */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-orange-400">Gestion du Logement</h2>
              <p className="text-sm text-slate-400">Compteur Woyofal, délestages et cuisine maison.</p>
            </div>

            {/* Outage alert */}
            {housing.outage && (
              <div className="bg-rose-900/40 border border-rose-500/50 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-rose-400" />
                  <div>
                    <h4 className="font-bold text-rose-200">Coupure de courant (Délestage CIE) !</h4>
                    <p className="text-xs text-rose-300">Allumez votre groupe électrogène ou attendez le rétablissement.</p>
                  </div>
                </div>
                {housing.hasGenerator ? (
                  <button 
                    onClick={() => setHousing(prev => ({ ...prev, outage: false, generatorActive: true }))}
                    className="bg-amber-600 px-4 py-2 rounded-lg font-bold text-xs"
                  >
                    Démarrer le Groupe Électrogène
                  </button>
                ) : (
                  <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg text-slate-400">Pas de groupe électrogène</span>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Electricity box */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" /> Compteur Prépayé Woyofal / CIE
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Rechargez du crédit kWh pour conserver la climatisation et la lumière.</p>
                  </div>
                  <span className="text-2xl font-black text-amber-400">{housing.electricityKwh} kWh</span>
                </div>

                <div className
