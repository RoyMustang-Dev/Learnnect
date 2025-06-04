import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userDataService, UserProfile } from '../services/userDataService';
import ProfileHeader from '../components/Profile/ProfileHeader';
import AboutSection from '../components/Profile/AboutSection';
import ExperienceSection from '../components/Profile/ExperienceSection';
import EducationSection from '../components/Profile/EducationSection';
import SkillsSection from '../components/Profile/SkillsSection';
import CertificationsSection from '../components/Profile/CertificationsSection';
import ProjectsSection from '../components/Profile/ProjectsSection';
import LanguagesSection from '../components/Profile/LanguagesSection';
import VolunteerSection from '../components/Profile/VolunteerSection';
import AccomplishmentsSection from '../components/Profile/AccomplishmentsSection';
import ContactInfoSection from '../components/Profile/ContactInfoSection';
import ProfileSidebar from '../components/Profile/ProfileSidebar';
import { Loader2 } from 'lucide-react';

const LinkedInProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Load user profile on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) return;

      try {
        const profile = await userDataService.getUserProfile(user.id);
        if (profile) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user?.id]);

  const handleProfileUpdate = async () => {
    if (!user?.id) return;
    
    try {
      const updatedProfile = await userDataService.getUserProfile(user.id);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-neon-cyan mx-auto mb-4" />
          <p className="text-cyan-200">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Failed to load profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Header */}
            <ProfileHeader 
              userProfile={userProfile} 
              onUpdate={handleProfileUpdate}
              isEditing={activeSection === 'header'}
              onEditToggle={() => setActiveSection(activeSection === 'header' ? null : 'header')}
            />

            {/* About Section */}
            <AboutSection 
              userProfile={userProfile} 
              onUpdate={handleProfileUpdate}
              isEditing={activeSection === 'about'}
              onEditToggle={() => setActiveSection(activeSection === 'about' ? null : 'about')}
            />

            {/* Experience Section */}
            <ExperienceSection 
              userProfile={userProfile} 
              onUpdate={handleProfileUpdate}
              isEditing={activeSection === 'experience'}
              onEditToggle={() => setActiveSection(activeSection === 'experience' ? null : 'experience')}
            />

            {/* Education Section */}
            <EducationSection 
              userProfile={userProfile} 
              onUpdate={handleProfileUpdate}
              isEditing={activeSection === 'education'}
              onEditToggle={() => setActiveSection(activeSection === 'education' ? null : 'education')}
            />

            {/* Skills Section */}
            <SkillsSection 
              userProfile={userProfile} 
              onUpdate={handleProfileUpdate}
              isEditing={activeSection === 'skills'}
              onEditToggle={() => setActiveSection(activeSection === 'skills' ? null : 'skills')}
            />

            {/* Certifications Section */}
            <CertificationsSection 
              userProfile={userProfile} 
              onUpdate={handleProfileUpdate}
              isEditing={activeSection === 'certifications'}
              onEditToggle={() => setActiveSection(activeSection === 'certifications' ? null : 'certifications')}
            />

            {/* Projects Section */}
            <ProjectsSection 
              userProfile={userProfile} 
              onUpdate={handleProfileUpdate}
              isEditing={activeSection === 'projects'}
              onEditToggle={() => setActiveSection(activeSection === 'projects' ? null : 'projects')}
            />

            {/* Languages Section */}
            <LanguagesSection 
              userProfile={userProfile} 
              onUpdate={handleProfileUpdate}
              isEditing={activeSection === 'languages'}
              onEditToggle={() => setActiveSection(activeSection === 'languages' ? null : 'languages')}
            />

            {/* Volunteer Experience Section */}
            <VolunteerSection 
              userProfile={userProfile} 
              onUpdate={handleProfileUpdate}
              isEditing={activeSection === 'volunteer'}
              onEditToggle={() => setActiveSection(activeSection === 'volunteer' ? null : 'volunteer')}
            />

            {/* Accomplishments Section */}
            <AccomplishmentsSection 
              userProfile={userProfile} 
              onUpdate={handleProfileUpdate}
              isEditing={activeSection === 'accomplishments'}
              onEditToggle={() => setActiveSection(activeSection === 'accomplishments' ? null : 'accomplishments')}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Contact Info */}
              <ContactInfoSection 
                userProfile={userProfile} 
                onUpdate={handleProfileUpdate}
                isEditing={activeSection === 'contact'}
                onEditToggle={() => setActiveSection(activeSection === 'contact' ? null : 'contact')}
              />

              {/* Profile Sidebar */}
              <ProfileSidebar userProfile={userProfile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInProfilePage;
