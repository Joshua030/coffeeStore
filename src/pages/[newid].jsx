import Head from "next/head"
import { useRouter } from "next/router"

const Prueba= () => {
    const router = useRouter()
    const { newid } = router.query
  return (
    <>
     <Head>
        <title>{newid}</title>
      </Head>
      <div>Page <small>{newid}</small></div>
    </>
  )
}

export default Prueba;
