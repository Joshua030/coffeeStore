import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import Banner from "components/banner";
import Card from "components/Card";
import coffeeStoresData from "data/coffee-stores.json";
import { fetchCoffeeStores } from "lib/coffee-stores";
import useTrackLocation from "hooks/use-track-location";
import { useContext, useEffect, useState } from "react";
import { ACTION_TYPES, StoreContext } from "./_app";
import { PacmanLoader } from "react-spinners";

export async function getStaticProps() {
  // fsq3dY1XgTfByBT0eV2Mys3L9uhG5ecHu9qfinDHBIEmfjI=
  const coffeeStores = await fetchCoffeeStores();

  // .catch((err) => console.error(err));
  return {
    props: { coffeeStores }, // will be passed to the page component as props
  };
}
const inter = Inter({ subsets: ["latin"] });

export default function Home({ coffeeStores }) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();
  // const [coffeStore, setcoffeStore] = useState('')
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  const { dispatch, state } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);

  const { coffeStore, latLong } = state;
  // console.log({latLong,locationErrorMsg});

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/getCoffeeStoreByLocation?latLong=${latLong}&limit=30`
          );

          const coffeeStores = await response.json();
          // setcoffeStore(fetchedCoffeeStores)
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeStore: coffeeStores,
            },
          });
          setCoffeeStoresError("");
          setLoading(false);
          //set coffee stores
        } catch (error) {
          //set error
          console.log("Error", { error });
          setCoffeeStoresError(error.message);
          setLoading(false);
        }
      }
    }
    setCoffeeStoresByLocation();
  }, [latLong]);

  const handleOnBannerButtonClick = () => {
    handleTrackLocation();
  };

  const handleChildAction = () => {
    setLoading(true);
  };


  return (
    <>
      {loading ? (
        <PacmanLoader
          className={styles.loader}
          color="rgba(67, 56, 202, 1)"
          size={50}
          loading={loading}
        />
      ) : (
        <div>
          <Head>
            <title>Coffee Connoisseur</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <main className={styles.main}>
            <div className={styles.container}>
              <Banner
                buttonText={
                  isFindingLocation ? "Locating..." : "View stores nearby"
                }
                handleOnClick={handleOnBannerButtonClick}
              />
              {locationErrorMsg && (
                <p>Something went wrong: {locationErrorMsg}</p>
              )}
              {coffeeStoresError && (
                <p>Something went wrong: {coffeeStoresError}</p>
              )}
            </div>
            <Image
              src="/static/hero-image.png"
              width={700}
              height={400}
              className={styles.heroImg}
              alt="hero image"
            />

            {coffeStore.length > 0 && (
              <div className={styles.sectionWrapper}>
                <h2 className={styles.heading2}>Stores near me</h2>
                <div className={styles.cardLayout}>
                  {coffeStore.map(({ fsq_id, name, imgUrl, websiteUrl }) => {
                    return (
                      <Card
                        key={fsq_id}
                        name={name}
                        imgUrl={
                          imgUrl ||
                          "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                        }
                        href={`/coffee-store/${fsq_id}`}
                        className={styles.card}
                        onAction={handleChildAction}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            {coffeeStores.length > 0 && (
              <>
                <h2 className={styles.heading2}>Toronto Stores</h2>
                <div className={styles.cardLayout}>
                  {coffeeStores?.map(({ fsq_id, name, imgUrl, websiteUrl }) => (
                    <Card
                      key={fsq_id}
                      name={name}
                      imgUrl={imgUrl}
                      href={`/coffee-store/${fsq_id}`}
                      onAction={handleChildAction}
                    />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      )}
    </>
  );
}
