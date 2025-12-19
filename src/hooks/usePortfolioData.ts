import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  profilesService, 
  projectsService, 
  educationService, 
  skillsService, 
  experiencesService, 
  achievementsService 
} from "@/integrations/firebase/services";

// Profile hooks
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const data = await profilesService.getCurrent();
      return data;
    },
  });
};

// Projects hooks
export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const data = await projectsService.getAllPublic();
      return data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    },
  });
};

// Education hooks
export const useEducation = () => {
  return useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const data = await educationService.getAllPublic();
      return data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    },
  });
};

// Skills hooks
export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const data = await skillsService.getAllPublic();
      return data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    },
  });
};

// Leadership/Experiences hooks
export const useLeadership = () => {
  return useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const data = await experiencesService.getAllPublic('leadership');
      return data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    },
  });
};

// Achievements hooks
export const useAchievements = () => {
  return useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const data = await achievementsService.getAllPublic();
      return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
  });
};
