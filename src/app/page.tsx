import MarketingPage from "@/components/pages/marketing/MarketingPage";
import { getAuthenticatedAppForUser } from "@/app/lib/firebase/serverApp";
import { User } from "firebase/auth";


export default async function Page() {
  const { currentUser } = await getAuthenticatedAppForUser();

  return <MarketingPage currentUser={currentUser?.toJSON() as User | undefined}/>
}
