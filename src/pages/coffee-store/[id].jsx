import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../../styles/coffeeStore.module.css";
import Image from "next/image";
import cls from "classnames";
import { fetchCoffeeStores } from "lib/coffee-stores";
import { useContext, useEffect, useState } from "react";
import { fetcher, isEmpty } from "utils";
import { StoreContext } from "../_app";
import useSWR from "swr";
import { PacmanLoader } from "react-spinners";

export async function getStaticProps({ params }) {
  // const { id } = params;

  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find(
    (element) => element.fsq_id == params.id
  );

  return {
    props: {
      coffeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map(({ fsq_id }) => {
    return {
      params: {
        id: fsq_id.toString(),
      },
    };
  });
  return {
    // paths: [{ params: { id: "0" } }, { params: { id: "1" } }],
    paths,
    fallback: true, // can also be true or 'blocking'
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();
  const id = router.query.id;
  if (router.isFallback) return <div>Loading...</div>;
  //  console.log(coffeStore);
  // const { name, location, imgUrl } = coffeStore;
  const [coffeeStoreState, setCoffeeStoreState] = useState(
    initialProps.coffeStore
  );

  // const [loading, setLoading] = useState(false);

  const { state } = useContext(StoreContext);

  //create coffe store

  const handleCreateCoffeeStore = async (data) => {
    try {
      const { fsq_id, name, imgUrl, voting, location } = data;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: fsq_id,
          name,
          voting,
          imgUrl,
          locality: location?.locality || "",
          address: location?.address || "",
        }),
      });

      const dbCoffeeStore = await response.json();
      // console.log({ dbCoffeeStore });
    } catch (err) {
      console.error("Error creating coffee store", err);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeStore)) {
      if (state.coffeStore.length > 0) {
        const findCoffeeStoreById = state.coffeStore.find(
          (element) => element.fsq_id == id
        );
        // console.log({findCoffeeStoreById })
        setCoffeeStoreState(findCoffeeStoreById);
        handleCreateCoffeeStore(findCoffeeStoreById);
      }
    } else {
      // console.log("initial", initialProps.coffeStore);
      // console.log("hook", coffeeStoreState);
      handleCreateCoffeeStore(initialProps.coffeStore);
    }
  }, [id, initialProps.coffeeStore]);

  const { name, location, imgUrl } = coffeeStoreState;

  //  console.log(initialProps);
  const [votingCount, setVotingCount] = useState(0);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);
  // console.log({ data });

  useEffect(() => {
    if (data && data.length > 0) {
      // console.log("data from SWR", data);
      const transformedData = data.map((obj) => {
        const { address, locality } = obj;
        return { ...obj, location: { address, locality } };
      });
      setCoffeeStoreState(transformedData[0]);
      setVotingCount(transformedData[0].voting);
    }
  }, [data]);

  // votes
  // const handleClickLoading= () => {
  //   setLoading(true);
  // };


  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error("Error upvoting the coffee store", err);
    }
  };

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

  // console.log({state});

  return (
    <>
      {/* {loading ? (
        <PacmanLoader
          className={styles.loader}
          color="rgba(67, 56, 202, 1)"
          size={50}
          loading={loading}
        />
      ) : (
        <div> */}
          <div className={styles.layout}>
            <Head>
              <title>{name}</title>
              <meta name="description" content={`${name} coffee store`}></meta>
            </Head>
            <div className={styles.container}>
              <div className={styles.col1}>
                <div className={styles.backToHomeLink}>
                  <Link href="/" > Back to home</Link>
                </div>
                <div className={styles.nameWrapper}>
                  <h1 className={styles.name}>{name}</h1>
                </div>
                <Image
                  src={
                    imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  width={300}
                  height={180}
                  className={styles.storeImg}
                  alt={name}
                />
              </div>

              <div className={cls("glass", styles.col2)}>
                <div className={styles.iconWrapper}>
                  <Image
                    src="/static/icons/places.svg"
                    width={24}
                    height={24}
                    alt="places icon"
                  />
                  <p className={styles.text}>{location?.address}</p>
                </div>
                <div className={styles.iconWrapper}>
                  <Image
                    src="/static/icons/nearMe.svg"
                    width={24}
                    height={24}
                    alt="nearme icon"
                  />
                  <p className={styles.text}>{location?.locality}</p>
                </div>
                <div className={styles.iconWrapper}>
                  <Image src="/static/icons/star.svg" width={24} height={24} alt="star icon" />
                  <p className={styles.text}>{votingCount}</p>
                </div>
                <button
                  className={styles.upvoteButton}
                  onClick={handleUpvoteButton}
                >
                  Up vote!
                </button>
              </div>
            </div>
          </div>
        {/* </div>
      )} */}
    </>
  );
};

export default CoffeeStore;
