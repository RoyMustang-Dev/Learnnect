import { UserProfile } from './userDataService';

export interface ProfileStrengthAnalysis {
  overallScore: number;
  completedSections: ProfileSection[];
  missingSections: ProfileSection[];
  recommendations: string[];
  strengthLevel: 'weak' | 'fair' | 'good' | 'strong' | 'excellent';
}

export interface ProfileSection {
  name: string;
  weight: number;
  completed: boolean;
  score: number;
  description: string;
  recommendations?: string[];
}

class ProfileStrengthService {
  // Define section weights based on importance for professional profiles
  private readonly SECTION_WEIGHTS = {
    // Core Identity (40% total)
    basicInfo: { weight: 15, name: 'Basic Information' },
    profilePhoto: { weight: 10, name: 'Profile Photo' },
    headline: { weight: 15, name: 'Professional Headline' },
    
    // Professional Background (35% total)
    about: { weight: 10, name: 'About Section' },
    experience: { weight: 15, name: 'Work Experience' },
    education: { weight: 10, name: 'Education' },
    
    // Skills & Achievements (25% total)
    skills: { weight: 8, name: 'Skills' },
    certifications: { weight: 7, name: 'Certifications' },
    projects: { weight: 5, name: 'Projects' },
    resume: { weight: 5, name: 'Resume Upload' },

    // Additional Information (5% total)
    languages: { weight: 2, name: 'Languages' },
    volunteer: { weight: 2, name: 'Volunteer Experience' },
    accomplishments: { weight: 1, name: 'Accomplishments' }
  };

  /**
   * Calculate comprehensive profile strength
   */
  calculateProfileStrength(userProfile: UserProfile): ProfileStrengthAnalysis {
    const sections = this.analyzeSections(userProfile);
    const overallScore = this.calculateOverallScore(sections);
    const strengthLevel = this.getStrengthLevel(overallScore);
    
    const completedSections = sections.filter(s => s.completed);
    const missingSections = sections.filter(s => !s.completed);
    const recommendations = this.generateRecommendations(missingSections, overallScore);

    return {
      overallScore,
      completedSections,
      missingSections,
      recommendations,
      strengthLevel
    };
  }

  /**
   * Analyze each profile section
   */
  private analyzeSections(profile: UserProfile): ProfileSection[] {
    return [
      this.analyzeBasicInfo(profile),
      this.analyzeProfilePhoto(profile),
      this.analyzeHeadline(profile),
      this.analyzeAbout(profile),
      this.analyzeExperience(profile),
      this.analyzeEducation(profile),
      this.analyzeSkills(profile),
      this.analyzeCertifications(profile),
      this.analyzeProjects(profile),
      this.analyzeResume(profile),
      this.analyzeLanguages(profile),
      this.analyzeVolunteer(profile),
      this.analyzeAccomplishments(profile)
    ];
  }

  /**
   * Analyze basic information completeness
   */
  private analyzeBasicInfo(profile: UserProfile): ProfileSection {
    const requiredFields = [
      profile.displayName,
      profile.firstName,
      profile.lastName,
      profile.email,
      profile.location
    ];

    const completedFields = requiredFields.filter(field => 
      field && field.toString().trim().length > 0
    ).length;

    const score = (completedFields / requiredFields.length) * 100;
    const completed = score >= 80; // 80% threshold

    return {
      name: this.SECTION_WEIGHTS.basicInfo.name,
      weight: this.SECTION_WEIGHTS.basicInfo.weight,
      completed,
      score,
      description: `${completedFields}/${requiredFields.length} required fields completed`,
      recommendations: completed ? [] : [
        'Complete your full name',
        'Add your location',
        'Verify your email address'
      ]
    };
  }

  /**
   * Analyze profile photo
   */
  private analyzeProfilePhoto(profile: UserProfile): ProfileSection {
    const hasPhoto = !!(profile.photoURL && profile.photoURL.trim().length > 0);
    
    return {
      name: this.SECTION_WEIGHTS.profilePhoto.name,
      weight: this.SECTION_WEIGHTS.profilePhoto.weight,
      completed: hasPhoto,
      score: hasPhoto ? 100 : 0,
      description: hasPhoto ? 'Professional photo uploaded' : 'No profile photo',
      recommendations: hasPhoto ? [] : [
        'Upload a professional headshot',
        'Use a high-quality image',
        'Ensure good lighting and clear visibility'
      ]
    };
  }

  /**
   * Analyze professional headline
   */
  private analyzeHeadline(profile: UserProfile): ProfileSection {
    const headline = profile.headline || '';
    const hasHeadline = headline.trim().length > 0;
    const isDetailed = headline.length >= 50; // Good headlines are descriptive
    
    const score = hasHeadline ? (isDetailed ? 100 : 60) : 0;
    const completed = score >= 60;

    return {
      name: this.SECTION_WEIGHTS.headline.name,
      weight: this.SECTION_WEIGHTS.headline.weight,
      completed,
      score,
      description: hasHeadline ? 
        `${headline.length} characters` : 
        'No professional headline',
      recommendations: completed ? [] : [
        'Add a compelling professional headline',
        'Include your role and key skills',
        'Make it specific and engaging (50+ characters)'
      ]
    };
  }

  /**
   * Analyze about section
   */
  private analyzeAbout(profile: UserProfile): ProfileSection {
    const about = profile.about || '';
    const hasAbout = about.trim().length > 0;
    const isComprehensive = about.length >= 200; // Good about sections are detailed
    
    const score = hasAbout ? (isComprehensive ? 100 : 70) : 0;
    const completed = score >= 70;

    return {
      name: this.SECTION_WEIGHTS.about.name,
      weight: this.SECTION_WEIGHTS.about.weight,
      completed,
      score,
      description: hasAbout ? 
        `${about.length} characters` : 
        'No about section',
      recommendations: completed ? [] : [
        'Write a compelling about section',
        'Highlight your expertise and achievements',
        'Include your career goals and interests'
      ]
    };
  }

  /**
   * Analyze work experience
   */
  private analyzeExperience(profile: UserProfile): ProfileSection {
    const experience = profile.experience || [];
    const hasExperience = experience.length > 0;
    const hasDetailedExperience = experience.some(exp => 
      exp.description && exp.description.length >= 100
    );
    
    let score = 0;
    if (hasExperience) {
      score = 50; // Base score for having experience
      if (experience.length >= 2) score += 25; // Multiple positions
      if (hasDetailedExperience) score += 25; // Detailed descriptions
    }
    
    const completed = score >= 50;

    return {
      name: this.SECTION_WEIGHTS.experience.name,
      weight: this.SECTION_WEIGHTS.experience.weight,
      completed,
      score,
      description: `${experience.length} position(s) listed`,
      recommendations: completed ? [] : [
        'Add your work experience',
        'Include detailed job descriptions',
        'Highlight key achievements and responsibilities'
      ]
    };
  }

  /**
   * Analyze education
   */
  private analyzeEducation(profile: UserProfile): ProfileSection {
    const education = profile.education || [];
    const hasEducation = education.length > 0;
    
    const score = hasEducation ? 100 : 0;
    const completed = hasEducation;

    return {
      name: this.SECTION_WEIGHTS.education.name,
      weight: this.SECTION_WEIGHTS.education.weight,
      completed,
      score,
      description: `${education.length} education entry(ies)`,
      recommendations: completed ? [] : [
        'Add your educational background',
        'Include degrees, certifications, and relevant coursework'
      ]
    };
  }

  /**
   * Analyze skills
   */
  private analyzeSkills(profile: UserProfile): ProfileSection {
    const skills = profile.skills || [];
    const hasSkills = skills.length > 0;
    const hasEnoughSkills = skills.length >= 5; // Good profiles have multiple skills
    
    const score = hasSkills ? (hasEnoughSkills ? 100 : 60) : 0;
    const completed = score >= 60;

    return {
      name: this.SECTION_WEIGHTS.skills.name,
      weight: this.SECTION_WEIGHTS.skills.weight,
      completed,
      score,
      description: `${skills.length} skill(s) listed`,
      recommendations: completed ? [] : [
        'Add your key skills',
        'Include both technical and soft skills',
        'Aim for at least 5-10 relevant skills'
      ]
    };
  }

  /**
   * Analyze certifications
   */
  private analyzeCertifications(profile: UserProfile): ProfileSection {
    const certifications = profile.certifications || [];
    const hasCertifications = certifications.length > 0;
    
    const score = hasCertifications ? 100 : 0;
    const completed = hasCertifications;

    return {
      name: this.SECTION_WEIGHTS.certifications.name,
      weight: this.SECTION_WEIGHTS.certifications.weight,
      completed,
      score,
      description: `${certifications.length} certification(s)`,
      recommendations: completed ? [] : [
        'Add relevant certifications',
        'Include professional licenses and credentials'
      ]
    };
  }

  /**
   * Analyze projects
   */
  private analyzeProjects(profile: UserProfile): ProfileSection {
    const projects = profile.projects || [];
    const hasProjects = projects.length > 0;
    
    const score = hasProjects ? 100 : 0;
    const completed = hasProjects;

    return {
      name: this.SECTION_WEIGHTS.projects.name,
      weight: this.SECTION_WEIGHTS.projects.weight,
      completed,
      score,
      description: `${projects.length} project(s)`,
      recommendations: completed ? [] : [
        'Showcase your key projects',
        'Include project descriptions and outcomes'
      ]
    };
  }

  /**
   * Analyze resume upload
   */
  private analyzeResume(profile: UserProfile): ProfileSection {
    // Check if user has uploaded any resumes
    // This would typically check a resumes array or resume field
    const hasResume = !!(profile as any).resumes && (profile as any).resumes.length > 0;

    const score = hasResume ? 100 : 0;
    const completed = hasResume;

    return {
      name: this.SECTION_WEIGHTS.resume.name,
      weight: this.SECTION_WEIGHTS.resume.weight,
      completed,
      score,
      description: hasResume ? 'Resume uploaded' : 'No resume uploaded',
      recommendations: completed ? [] : [
        'Upload your resume for better profile visibility',
        'Keep your resume updated with latest experience',
        'Use a professional format (PDF recommended)'
      ]
    };
  }

  /**
   * Analyze languages
   */
  private analyzeLanguages(profile: UserProfile): ProfileSection {
    const languages = profile.languages || [];
    const hasLanguages = languages.length > 0;
    
    const score = hasLanguages ? 100 : 0;
    const completed = hasLanguages;

    return {
      name: this.SECTION_WEIGHTS.languages.name,
      weight: this.SECTION_WEIGHTS.languages.weight,
      completed,
      score,
      description: `${languages.length} language(s)`,
      recommendations: completed ? [] : [
        'Add languages you speak',
        'Include proficiency levels'
      ]
    };
  }

  /**
   * Analyze volunteer experience
   */
  private analyzeVolunteer(profile: UserProfile): ProfileSection {
    const volunteer = profile.volunteer || [];
    const hasVolunteer = volunteer.length > 0;
    
    const score = hasVolunteer ? 100 : 0;
    const completed = hasVolunteer;

    return {
      name: this.SECTION_WEIGHTS.volunteer.name,
      weight: this.SECTION_WEIGHTS.volunteer.weight,
      completed,
      score,
      description: `${volunteer.length} volunteer experience(s)`,
      recommendations: completed ? [] : [
        'Add volunteer experiences',
        'Highlight community involvement'
      ]
    };
  }

  /**
   * Analyze accomplishments
   */
  private analyzeAccomplishments(profile: UserProfile): ProfileSection {
    const accomplishments = profile.accomplishments || [];
    const hasAccomplishments = accomplishments.length > 0;
    
    const score = hasAccomplishments ? 100 : 0;
    const completed = hasAccomplishments;

    return {
      name: this.SECTION_WEIGHTS.accomplishments.name,
      weight: this.SECTION_WEIGHTS.accomplishments.weight,
      completed,
      score,
      description: `${accomplishments.length} accomplishment(s)`,
      recommendations: completed ? [] : [
        'Add notable accomplishments',
        'Include awards and recognitions'
      ]
    };
  }

  /**
   * Calculate weighted overall score
   */
  private calculateOverallScore(sections: ProfileSection[]): number {
    const totalWeight = Object.values(this.SECTION_WEIGHTS).reduce((sum, section) => sum + section.weight, 0);
    const weightedScore = sections.reduce((sum, section) => {
      return sum + (section.score * section.weight / 100);
    }, 0);
    
    return Math.round(weightedScore / totalWeight * 100);
  }

  /**
   * Determine strength level based on score
   */
  private getStrengthLevel(score: number): 'weak' | 'fair' | 'good' | 'strong' | 'excellent' {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'strong';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'weak';
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(missingSections: ProfileSection[], overallScore: number): string[] {
    const recommendations: string[] = [];
    
    // Prioritize high-weight missing sections
    const prioritySections = missingSections
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3);

    prioritySections.forEach(section => {
      if (section.recommendations) {
        recommendations.push(...section.recommendations);
      }
    });

    // Add general recommendations based on score
    if (overallScore < 50) {
      recommendations.push('Focus on completing your basic profile information first');
    } else if (overallScore < 75) {
      recommendations.push('Add more detailed descriptions to showcase your expertise');
    } else {
      recommendations.push('Your profile is strong! Consider adding recent projects or achievements');
    }

    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }
}

export const profileStrengthService = new ProfileStrengthService();
export default profileStrengthService;
