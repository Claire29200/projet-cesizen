
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ProfileHeader defaultTab="profile">
            <ProfileTabs />
          </ProfileHeader>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
