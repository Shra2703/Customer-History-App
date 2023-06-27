// total no of seats and capacity
let seatsLeft = 25;
let capacity = 25;

// array to store the customers
let customers = [];

// ref to get the value in the input fields
let nameRef = React.createRef();
let countRef = React.createRef();
let phoneRef = React.createRef();
let formRef = React.createRef();

// to clear the values in the form after submit
function clearValues() {
  phoneRef.current.value = "";
  nameRef.current.value = "";
  countRef.current.value = "";
}

// function to check the duplicate entries
function checkIfEntryExists (phone){
    return customers.find((c) => c.phone === phone && !c.checkout);
  };

// to add the customers in the array
function customerHistory(name, phone, count) {
  let details = {
    count,
    name,
    phone,
    checkin: new Date(),
    checkout: null,
  };

  customers.unshift(details);
  console.log(customers);
}

// function when the delete button will be clicked
function handleRemove(i){
    let removedEntry = customers.splice(i,1);
    // console.log("hii")
    // console.log(removedEntry);
    // console.log("hii")
    // console.log(removedEntry[0]);
    
    if(!removedEntry[0].checkout){
        seatsLeft += +(removedEntry[0].count);
    }
    rootElement.render(<App/>);
}

// function when the checkout is being called
function handleCheckout(phone, count) {
  customers.forEach((c) => {
    if (c.phone === phone) {
      c.checkout = new Date();
    }
  });
  seatsLeft += +count;
  rootElement.render(<App />);
}

// this function is  getting executed when form get submitted
function handleSubmit(e) {
  e.preventDefault();

  let phone = phoneRef.current.value;
  let name = nameRef.current.value;
  let guestCount = countRef.current.value;

  if (guestCount > seatsLeft) {
    alert("Guest count exceeds the total no of seats left");
    clearValues();
    return;
  }

  if (checkIfEntryExists(phone)) {
    alert("User already exists.");
    clearValues();
    return;
  }

  seatsLeft -= guestCount;
  customerHistory(name, phone, guestCount);
  clearValues();
  rootElement.render(<App />);
}

// Form  Component  to make the form
const Form = () => (
  <form onSubmit={handleSubmit} ref={formRef}>
    <input
      type="number"
      placeholder="Enter the Guest Count"
      min = "1"
      ref={countRef}
      required
    />
    <input type="text" placeholder="Enter the name" ref={nameRef} required />
    <input
      type="text"
      placeholder="Enter the phone no."
      ref={phoneRef}
      required
    />
    <button type="submit">Submit</button>
  </form>
);

// Component to display the result on screen
const Result = () => (
  <table border="1">
    <thead>
      <tr>
        <td>Guest Count</td>
        <td>Name</td>
        <td>Phone no</td>
        <td>Check In</td>
        <td>Check Out</td>
        <td>Status</td>
        <td>Remove Entry</td>
      </tr>
    </thead>

    <tbody>
      {customers.map((c, i) => (
        <tr key={i}>
          <td>{c.count}</td>
          <td>{c.name}</td>
          <td>{c.phone}</td>
          <td>{c.checkin.toLocaleTimeString()}</td>
          <td>{c.checkout ? c.checkout.toLocaleTimeString() : <>-</>}</td>
          {c.checkout ? (
            <td className="served">Served</td>
          ) : (
            <td
              className="dining"
              onClick={() => handleCheckout(c.phone, c.count)}
            >
              Click to check out
            </td>
          )}
          <td onClick = {()=>handleRemove(i)} className="delete">Delete</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const App = () => (
  <div className="App">
    <div>
      <h2>Total Capacity:{capacity}</h2>
      <h2>Seats left:{seatsLeft}</h2>
    </div>
    <Form />
    <Result />
  </div>
);

const rootElement = ReactDOM.createRoot(document.getElementById("root"));
rootElement.render(<App />);
