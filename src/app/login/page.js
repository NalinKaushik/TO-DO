import styles from "./page.module.css";

export default function Home() {
    return(
        <div>
        <div className={styles.parent}>
            
            <div className={styles.wrapper}>
            <h3>Welcome Back</h3>
            <form className={styles.login}>    
                <input type="email" placeholder="Email"></input>
                <br></br>
                <input type="password" placeholder="Password"></input>
                <button type="submit" className={styles.nbtn}>Log in</button>
                <div className={styles.hr}></div>
                <button type="submit" className={styles.gbtn}>Log in with Google</button>
                <br></br>
                <span>Don't have an account. <a href="#" className={styles.link}>Sign up here</a></span>
            </form>
            </div>
        </div>
        </div>
    )
}