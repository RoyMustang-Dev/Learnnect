import React, { useState } from 'react';
import { UserProfile, Certification } from '../../services/userDataService';
import { Award, Edit3, Save, X, Plus, Trash2, Calendar, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userDataService } from '../../services/userDataService';

interface CertificationsSectionProps {
  userProfile: UserProfile;
  onUpdate: () => void;
  isEditing: boolean;
  onEditToggle: () => void;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  userProfile,
  onUpdate,
  isEditing,
  onEditToggle
}) => {
  const { user } = useAuth();
  const [certifications, setCertifications] = useState<Certification[]>(userProfile.certifications || []);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      await userDataService.updateUserProfile(user.id, { certifications });
      await onUpdate();
      onEditToggle();
    } catch (error) {
      console.error('Error updating certifications:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setCertifications(userProfile.certifications || []);
    onEditToggle();
  };

  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: '',
      organization: '',
      issueDate: '',
      expirationDate: '',
      credentialId: '',
      credentialUrl: '',
      skills: []
    };
    setCertifications([...certifications, newCertification]);
  };

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    setCertifications(certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const isExpired = (expirationDate: string) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
            <Award className="h-4 w-4 text-neon-cyan" />
          </div>
          <h2 className="text-xl font-bold text-white">Licenses & Certifications</h2>
        </div>
        
        {!isEditing ? (
          <button
            onClick={onEditToggle}
            className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-3 py-2 bg-neon-cyan text-black rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          {certifications.map((cert, index) => (
            <div key={cert.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">Certification {index + 1}</h3>
                <button
                  onClick={() => removeCertification(cert.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  placeholder="Certification name"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
                <input
                  type="text"
                  value={cert.organization}
                  onChange={(e) => updateCertification(cert.id, 'organization', e.target.value)}
                  placeholder="Issuing organization"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="month"
                  value={cert.issueDate}
                  onChange={(e) => updateCertification(cert.id, 'issueDate', e.target.value)}
                  placeholder="Issue date"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
                <input
                  type="month"
                  value={cert.expirationDate || ''}
                  onChange={(e) => updateCertification(cert.id, 'expirationDate', e.target.value)}
                  placeholder="Expiration date (optional)"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={cert.credentialId || ''}
                  onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                  placeholder="Credential ID"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
                <input
                  type="url"
                  value={cert.credentialUrl || ''}
                  onChange={(e) => updateCertification(cert.id, 'credentialUrl', e.target.value)}
                  placeholder="Credential URL"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
              </div>
              
              <input
                type="text"
                value={cert.skills?.join(', ') || ''}
                onChange={(e) => updateCertification(cert.id, 'skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                placeholder="Related skills (comma separated)"
                className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
              />
            </div>
          ))}
          
          <button
            onClick={addCertification}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors w-full justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add Certification</span>
          </button>
        </div>
      ) : (
        <div>
          {userProfile.certifications && userProfile.certifications.length > 0 ? (
            <div className="space-y-6">
              {userProfile.certifications.map((cert) => (
                <div key={cert.id} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Award className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{cert.name}</h3>
                        <p className="text-neon-cyan font-medium">{cert.organization}</p>
                      </div>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-cyan hover:text-cyan-300 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-gray-400 text-sm mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Issued {formatDate(cert.issueDate)}
                          {cert.expirationDate && (
                            <span className={isExpired(cert.expirationDate) ? 'text-red-400' : ''}>
                              {' · Expires '}{formatDate(cert.expirationDate)}
                              {isExpired(cert.expirationDate) && ' (Expired)'}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    
                    {cert.credentialId && (
                      <p className="text-gray-400 text-sm mt-1">
                        Credential ID: {cert.credentialId}
                      </p>
                    )}
                    
                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {cert.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-neon-cyan/10 text-neon-cyan text-xs rounded-full border border-neon-cyan/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">Add licenses and certifications</p>
              <p className="text-gray-500 text-sm mb-4">
                Showcase your professional credentials and achievements
              </p>
              <button
                onClick={onEditToggle}
                className="px-4 py-2 bg-neon-cyan text-black rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Add Certification
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificationsSection;
