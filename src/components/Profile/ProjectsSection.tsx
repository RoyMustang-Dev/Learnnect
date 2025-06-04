import React, { useState } from 'react';
import { UserProfile, Project } from '../../services/userDataService';
import { FolderOpen, Edit3, Save, X, Plus, Trash2, Calendar, ExternalLink, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userDataService } from '../../services/userDataService';

interface ProjectsSectionProps {
  userProfile: UserProfile;
  onUpdate: () => void;
  isEditing: boolean;
  onEditToggle: () => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  userProfile,
  onUpdate,
  isEditing,
  onEditToggle
}) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>(userProfile.projects || []);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      await userDataService.updateUserProfile(user.id, { projects });
      await onUpdate();
      onEditToggle();
    } catch (error) {
      console.error('Error updating projects:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProjects(userProfile.projects || []);
    onEditToggle();
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      url: '',
      skills: [],
      collaborators: []
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
            <FolderOpen className="h-4 w-4 text-neon-cyan" />
          </div>
          <h2 className="text-xl font-bold text-white">Projects</h2>
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
          {projects.map((project, index) => (
            <div key={project.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">Project {index + 1}</h3>
                <button
                  onClick={() => removeProject(project.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  placeholder="Project name"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
                <input
                  type="url"
                  value={project.url || ''}
                  onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                  placeholder="Project URL"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="month"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                  placeholder="Start date"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
                <input
                  type="month"
                  value={project.endDate || ''}
                  onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                  placeholder="End date (optional)"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
              </div>
              
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                placeholder="Project description"
                rows={4}
                className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 resize-none mb-4"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={project.skills?.join(', ') || ''}
                  onChange={(e) => updateProject(project.id, 'skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="Skills used (comma separated)"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
                <input
                  type="text"
                  value={project.collaborators?.join(', ') || ''}
                  onChange={(e) => updateProject(project.id, 'collaborators', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="Collaborators (comma separated)"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
              </div>
            </div>
          ))}
          
          <button
            onClick={addProject}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors w-full justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add Project</span>
          </button>
        </div>
      ) : (
        <div>
          {userProfile.projects && userProfile.projects.length > 0 ? (
            <div className="space-y-6">
              {userProfile.projects.map((project) => (
                <div key={project.id} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                        <div className="flex items-center space-x-4 text-gray-400 text-sm mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {formatDate(project.startDate)}
                              {project.endDate && ` - ${formatDate(project.endDate)}`}
                            </span>
                          </div>
                          {project.collaborators && project.collaborators.length > 0 && (
                            <>
                              <span>·</span>
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{project.collaborators.length} collaborator{project.collaborators.length !== 1 ? 's' : ''}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-cyan hover:text-cyan-300 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    
                    <p className="text-gray-300 mt-3 leading-relaxed whitespace-pre-wrap">
                      {project.description}
                    </p>
                    
                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.skills.map((skill, index) => (
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
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">Showcase your projects</p>
              <p className="text-gray-500 text-sm mb-4">
                Add projects to highlight your work and achievements
              </p>
              <button
                onClick={onEditToggle}
                className="px-4 py-2 bg-neon-cyan text-black rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Add Project
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
