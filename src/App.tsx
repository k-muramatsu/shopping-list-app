import { ShoppingList } from "./components/ShoppingList";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>買い物リスト</h1>
      <ShoppingList />
    </div>
  );
}

export default App;
