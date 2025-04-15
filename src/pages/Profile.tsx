
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const location = useLocation();
  const defaultTab = location.hash === "#resources" ? "resources" : "profile";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ProfileHeader defaultTab={defaultTab}>
            <ProfileTabs />
          </ProfileHeader>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
