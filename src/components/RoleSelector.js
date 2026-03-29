'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './RoleSelector.module.css';

export default function RoleSelector() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    firstName: '',
    lastName: '',
  });

  const getDemoFormByRole = (role) => {
    if (role === 'medecin') {
      return {
        identifier: 'INPE-45219',
        firstName: 'Mounir',
        lastName: 'Alaoui',
      };
    }

    return {
      identifier: 'AB123456',
      firstName: 'Youssef',
      lastName: 'El Amrani',
    };
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData(getDemoFormByRole(role));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoClick = () => {
    setSelectedRole(null);
    setIsSubmitting(false);
    setFormData(getDemoFormByRole('patient'));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!selectedRole) return;
    if (!formData.identifier || !formData.firstName || !formData.lastName) return;

    setIsSubmitting(true);
    setTimeout(() => {
      if (selectedRole === 'patient') {
        router.push('/patient');
      } else {
        router.push('/dashboard');
      }
    }, 260);
  };

  const identifierLabel = selectedRole === 'medecin' ? 'INPE' : 'CIN ou Code carte medicale';
  const isPatientChosen = selectedRole === 'patient';
  const isDoctorChosen = selectedRole === 'medecin';
  const formVisible = Boolean(selectedRole);

  return (
    <div className={styles.container}>
      {/* Animated Background */}
      <div className={styles.background}>
        <div className={styles.movingBackdrop}>
          <span className={`${styles.floatShape} ${styles.shapeOne}`}></span>
          <span className={`${styles.floatShape} ${styles.shapeTwo}`}></span>
          <span className={`${styles.floatShape} ${styles.shapeThree}`}></span>
          <span className={`${styles.floatShape} ${styles.shapeFour}`}></span>
        </div>
        <div className={styles.waveLayer}></div>
        <div className={styles.ringPulse}></div>
        <div className={styles.particlesLayer}>
          <span className={styles.particle}></span>
          <span className={styles.particle}></span>
          <span className={styles.particle}></span>
          <span className={styles.particle}></span>
          <span className={styles.particle}></span>
          <span className={styles.particle}></span>
        </div>
        <div className={`${styles.orb} ${styles.orbOne}`} style={{ '--orb-delay': '0s' }}></div>
        <div className={`${styles.orb} ${styles.orbTwo}`} style={{ '--orb-delay': '2s' }}></div>
        <div className={`${styles.orb} ${styles.orbThree}`} style={{ '--orb-delay': '4s' }}></div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.logoButton}
            onClick={handleLogoClick}
            aria-label="Revenir au choix du role"
          >
            <div className={styles.logoWrap}>
            <Image
              src="/logo-official-nobg.png"
              alt="Alwarid"
              fill
              priority
              sizes="(max-width: 768px) 92vw, 680px"
              className={styles.logoImage}
            />
            </div>
          </button>
          <h1 className={styles.title}>Bienvenue sur Alwarid</h1>
          <p className={styles.subtitle}>Selectionnez votre espace pour demarrer en toute securite.</p>
        </div>

        <div
          className={`${styles.rolesContainer} ${formVisible ? styles.rolesContainerSelected : ''} ${
            isPatientChosen ? styles.patientFlow : ''
          } ${isDoctorChosen ? styles.doctorFlow : ''}`}
        >
          {/* Patient Card */}
          <div
            className={`${styles.roleCard} ${styles.patientCard} ${isPatientChosen ? styles.selected : ''} ${
              isDoctorChosen ? styles.exitingPatient : ''
            }`}
          >
            <div className={styles.cardBackground}></div>
            <div className={styles.cardContent}>
              <div className={`${styles.icon} ${styles.patientIcon}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h2 className={styles.roleTitle}>Patient</h2>
              <p className={styles.roleDescription}>
                Accédez à votre dossier médical et consultez vos informations de santé
              </p>
              <button className={styles.cta} type="button" onClick={() => handleRoleSelect('patient')}>
                <span>Continuer</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className={styles.shimmer}></div>
          </div>

          {/* Médecin Card */}
          <div
            className={`${styles.roleCard} ${styles.doctorCard} ${isDoctorChosen ? styles.selected : ''} ${
              isPatientChosen ? styles.exitingDoctor : ''
            }`}
          >
            <div className={styles.cardBackground}></div>
            <div className={styles.cardContent}>
              <div className={`${styles.icon} ${styles.doctorIcon}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 8h12M6 12h12M6 16h12M3 6h1v12H3M20 6h1v12h-1" />
                </svg>
              </div>
              <h2 className={styles.roleTitle}>Médecin</h2>
              <p className={styles.roleDescription}>
                Consultez et gérez les dossiers de vos patients simplement
              </p>
              <button className={styles.cta} type="button" onClick={() => handleRoleSelect('medecin')}>
                <span>Continuer</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className={styles.shimmer}></div>
          </div>

          <form
            className={`${styles.authCard} ${formVisible ? styles.authCardVisible : ''}`}
            onSubmit={handleLogin}
            aria-hidden={!formVisible}
          >
            <h3 className={styles.authTitle}>Authentification {isDoctorChosen ? 'Medecin' : 'Patient'}</h3>
            <p className={styles.authSubtitle}>Mode demo: les champs sont pre-remplis avec des infos fictives.</p>

            <label className={styles.inputLabel}>
              {identifierLabel}
              <input
                className={styles.authInput}
                type="text"
                value={formData.identifier}
                onChange={(e) => handleInputChange('identifier', e.target.value)}
                placeholder={isDoctorChosen ? 'Ex: MA-20445' : 'Ex: AB123456'}
                required
              />
            </label>

            <label className={styles.inputLabel}>
              Nom
              <input
                className={styles.authInput}
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Votre nom"
                required
              />
            </label>

            <label className={styles.inputLabel}>
              Prenom
              <input
                className={styles.authInput}
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Votre prenom"
                required
              />
            </label>

            <button className={styles.loginBtn} type="submit" disabled={!formVisible || isSubmitting}>
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        <div className={styles.footer}>
          <p>Plateforme Médicale Professionnelle</p>
        </div>
      </div>
    </div>
  );
}
