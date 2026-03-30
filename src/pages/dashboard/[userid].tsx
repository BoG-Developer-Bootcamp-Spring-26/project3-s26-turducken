import { useRouter } from "next/router";

// This is where main dashboard is based on users unique id
export default function userid() {
    const router = useRouter();

    const { userid } = router.query;

  return (
    <div>
        <h1>Main Dashboard for user: {userid}</h1>
    </div>
    
  );
}