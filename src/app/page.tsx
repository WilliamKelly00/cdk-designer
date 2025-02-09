import MarketingPage from "@/components/pages/marketing/MarketingPage";
import { getAuthenticatedAppForUser } from "@/app/lib/firebase/serverApp";


export default async function Page() {
  const { currentUser } = await getAuthenticatedAppForUser();

  return <MarketingPage initialUser={currentUser?.toJSON()}/>
}
