import { useState } from "react";
import products from "./Products.js";
import "./App.css";

const cities = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Gurgaon", "Noida"];
const navs = ["Gaming", "Cameras", "Fitness", "Trekking"];

const heroData = {
  Gaming: { title: "Gaming Consoles", color: "#FFD93D", sub: "PS5, Xbox & More" },
  Cameras: { title: "Cameras on Rent", color: "#A5D6FF", sub: "Sony, GoPro, DJI Drones" },
  Fitness: { title: "Fitness on Rent", color: "#B9F5C3", sub: "Treadmill, Spin Bike & More" },
  Trekking: { title: "Trekking on Rent", color: "#FFD6A5", sub: "Tents, Backpacks & Gears" },
};

export default function App() {
  const [place, setPlace] = useState("Bangalore");
  const [showPlaces, setShowPlaces] = useState(false);
  const [activeNav, setActiveNav] = useState("Gaming");
  const [showLogin, setShowLogin] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [myOtp, setMyOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(() => {
    try { const saved = localStorage.getItem("sp_user"); return saved? JSON.parse(saved) : null; } catch { return null; }
  });
  const [pickup, setPickup] = useState("");
  const [ret, setRet] = useState("");
  const [showDates, setShowDates] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");

  const days = pickup && ret? Math.max(1, Math.ceil((new Date(ret) - new Date(pickup)) / 86400000)) : 1;
  const total = cart.reduce((a, b) => a + b.per_day_rent * b.days, 0);
  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  function addToCart(p) {
    if (p.out_of_stock) return;
    if (!user) { setStep("phone"); setShowLogin(true); return; }
    if (!pickup ||!ret) { setShowDates(true); return; }
    setCart([...cart, {...p, days, pickup, ret, place }]);
    setShowCart(true);
  }

  function sendOtp() {
    if (phone.length!== 10) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setMyOtp(code); setStep("otp");
    alert("OTP: " + code + " (123456 also works)");
  }
  function verify() {
    if (otp === myOtp || otp === "123456") {
      const saved = localStorage.getItem("sp_user");
      if (saved) {
        try {
          const ex = JSON.parse(saved);
          if (ex.phone === phone) { setUser(ex); setShowLogin(false); setStep("phone"); setOtp(""); return; }
        } catch (error) {
          console.error("Error parsing saved user data:", error);
        }
      }
      setStep("profile");
    } else alert("Wrong OTP");
  }
  function createAccount() {
    if (!name.trim() ||!email.includes("@")) return;
    const u = { phone, name: name.trim(), email: email.trim() };
    localStorage.setItem("sp_user", JSON.stringify(u));
    setUser(u); setShowLogin(false); setStep("phone"); setOtp("");
  }
  function logout() { localStorage.removeItem("sp_user"); setUser(null); }

  return (
    <div className="app">
      <div className="announcement">FREE DELIVERY • ZERO DEPOSIT • RENT MORE OWN LESS</div>
      <header className="top-header">
        <div className="top-left">
          <div className="logo">SharePal<span>.</span></div>
          <div className="place-wrap">
            <button className="place-btn" onClick={() => setShowPlaces(!showPlaces)}><span>DELIVER TO</span><strong>{place} ▼</strong></button>
            {showPlaces && <div className="place-dropdown">{cities.map(c=><button key={c} className={c===place?"active":""} onClick={()=>{setPlace(c);setShowPlaces(false)}}>{c}</button>)}</div>}
          </div>
        </div>
        <div className="top-center"><input className="search" placeholder={`Search ${activeNav} in ${place}`} value={search} onChange={e=>setSearch(e.target.value)} /></div>
        <div className="top-right">
          <div className="date-picker-wrap">
            <button className="header-button pill" onClick={()=>setShowDates(!showDates)}>{pickup&&ret?`${days}d`:"Dates"}</button>
            {showDates && <div className="date-dropdown"><h4>Select Dates</h4><label>Pickup<input type="date" value={pickup} onChange={e=>setPickup(e.target.value)} /></label><label>Return<input type="date" value={ret} onChange={e=>setRet(e.target.value)} min={pickup} /></label><button className="rent-button" onClick={()=>setShowDates(false)}>Done</button></div>}
          </div>
          <button className="header-button pill" onClick={()=>setShowCart(true)}>Cart ({cart.length})</button>
          {user? <div className="user-pill"><div className="user-avatar">{user.name[0]}</div><span>{user.name.split(" ")[0]}</span><button className="mini-logout" onClick={logout}>Logout</button></div> : <button className="header-button dark pill" onClick={()=>{setStep("phone");setShowLogin(true)}}>Login</button>}
        </div>
      </header>

      <nav className="navigation">
        <div className="nav-left">{navs.map(n=><span key={n} className={`nav-link ${activeNav===n?"active":""}`} onClick={()=>setActiveNav(n)}>{n}</span>)}</div>
        <div className="nav-right">{place} • {pickup&&ret?`${pickup} → ${ret}`:"Select dates"}</div>
      </nav>

      <section className="hero" style={{background: heroData[activeNav].color}}>
        <div>
          <h1>{heroData[activeNav].title}</h1>
          <p>Hi {user? user.name : "there"}! Rent {heroData[activeNav].sub} in {place} • {pickup && ret? `${days} days` : "Select dates"}</p>
        </div>
      </section>

      <main className="main-content">
        <div className="catalog-heading"><h2>{activeNav} on Rent in {place}</h2></div>

        {activeNav!=="Gaming"? (
          <div className="coming-box">
            <h3>{activeNav} launching soon in {place}</h3>
            <p>Company Products.js has only Gaming data. Click Gaming to see {products.length} items.</p>
            <button className="rent-button" style={{width:200, marginTop:12}} onClick={()=>setActiveNav("Gaming")}>Go to Gaming</button>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map(p=>(
              <div className="product-card" key={p.id}>
                <div className="product-image"><img src={p.image} alt={p.name} loading="lazy" />{p.tag && <span className={`product-tag ${p.tag}`}>{p.tag}</span>}{p.out_of_stock && <span className="product-tag oos">Out of Stock</span>}</div>
                <div className="product-details"><h3>{p.name}</h3><div className="meta">{p.rating? `${p.rating} ★` : "New"} • {p.booked_count} booked • {place}</div><div className="price">₹{p.per_day_rent}<span>/day</span></div><button className="rent-button" disabled={p.out_of_stock} onClick={()=>addToCart(p)}>{p.out_of_stock?"Out of Stock":"Rent Now"}</button></div>
              </div>
            ))}
          </div>
        )}
      </main>

     <footer className="sp-footer">
  <div className="footer-grid">
    <div><h4>SharePal</h4><p>India's Largest Rental Marketplace. {products.length} Gaming combos in {place}.</p></div>
    <div><h4>Categories</h4><ul>{navs.map(c => <li key={c} onClick={()=>setActiveNav(c)}>{c}</li>)}</ul></div>
    <div><h4>Places</h4><ul>{cities.map(c => <li key={c} onClick={()=>setPlace(c)}>{c}</li>)}</ul></div>
    <div><h4>Account</h4><ul><li>{user? user.name : "Login"}</li><li>{user? user.email : "Create Account"}</li><li>Cart {cart.length}</li></ul></div>
  </div>
  <div className="footer-bottom">© 2026 SharePal • {place} • {user? `Logged in as ${user.name} (${user.phone})` : "Guest"}</div>
</footer>

      {showLogin && <div className="login-overlay" onClick={()=>setShowLogin(false)}><div className="login-modal" onClick={e=>e.stopPropagation()}><button className="close-btn" onClick={()=>setShowLogin(false)}>✕</button>{step==="phone"&&<><h2>Login</h2><div className="phone-input-wrap"><span>+91</span><input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,""))} placeholder="Mobile" maxLength={10} /></div><button className="rent-button" style={{height:46,marginTop:14}} onClick={sendOtp}>Send OTP</button></>}{step==="otp"&&<><h2>Verify</h2><input className="otp-big" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="OTP" maxLength={6} /><div className="otp-hint">{myOtp} / 123456</div><button className="rent-button" style={{height:46,marginTop:14}} onClick={verify}>Verify</button></>}{step==="profile"&&<><h2>Create</h2><input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" style={{marginTop:12}} /><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{marginTop:10}} /><button className="rent-button" style={{height:46,marginTop:14}} onClick={createAccount}>Create</button></>}</div></div>}

      {showCart && <div className="login-overlay" onClick={()=>setShowCart(false)}><div className="cart-drawer" onClick={e=>e.stopPropagation()}><div className="cart-head"><h3>Cart ({cart.length}) - kee</h3><button className="close-btn" onClick={()=>setShowCart(false)}>✕</button></div><div className="cart-body">{cart.map((item,i)=><div key={i} className="cart-item"><img src={item.image} alt="" /><div className="cart-item-info"><div className="cart-name">{item.name}</div><div className="meta">{item.place} • {item.days} Days</div><div className="price">₹{item.per_day_rent * item.days}</div></div><button className="remove-btn" onClick={()=>setCart(cart.filter((_,idx)=>idx!==i))}>✕</button></div>)}</div>{cart.length>0 && <div className="cart-foot"><div className="total"><span>Total ({days} days)</span><strong>₹{total}</strong></div><button className="rent-button" style={{height:46,marginTop:12}} onClick={()=>{ const id="SP"+Math.floor(100000+Math.random()*900000); setOrderId(id); setShowSuccess(true); setShowCart(false); }}>Checkout • ₹{total}</button></div>}</div></div>}

      {showSuccess && <div className="login-overlay" onClick={()=>{setShowSuccess(false);setCart([]);}}><div className="login-modal" style={{maxWidth:380, textAlign:'center'}} onClick={e=>e.stopPropagation()}><div style={{fontSize:50}}>✅</div><h2>Order Placed!</h2><p>Thank you {user?.name}!</p><div style={{background:"#f5f5f5", padding:12, borderRadius:12, marginTop:14, textAlign:'left', fontSize:13, lineHeight:1.8}}><div><strong>Order ID:</strong> {orderId}</div><div><strong>Name:</strong> {user?.name}</div><div><strong>Phone:</strong> +91 {user?.phone}</div><div><strong>Place:</strong> {place}</div><div><strong>Days:</strong> {days} ({pickup} → {ret})</div><div><strong>Total:</strong> ₹{total}</div></div><button className="rent-button" style={{height:46,marginTop:16}} onClick={()=>{setShowSuccess(false);setCart([]);}}>Continue</button></div></div>}
    </div>
  );
}