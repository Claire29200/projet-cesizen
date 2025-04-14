
import { TabsContent } from "@/components/ui/tabs";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { AccountActions } from "@/components/profile/AccountActions";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { DiagnosticHistory } from "@/components/profile/DiagnosticHistory";

export const ProfileTabs = () => {
  return (
    <>
      <TabsContent value="profile" className="space-y-6">
        <PersonalInfoForm />
        <AccountActions />
      </TabsContent>
      
      <TabsContent value="security" className="space-y-6">
        <PasswordChangeForm />
      </TabsContent>
      
      <TabsContent value="diagnostics" className="space-y-6">
        <DiagnosticHistory />
      </TabsContent>
    </>
  );
};
