import {
  Alert,
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { capitalizeFirstLetter, formatPrice } from "../../assets/helpers";
import { Crypto, Error, User } from "../../data/models";
import { sellCrypto } from "../../data/api";
import { LoadingUx } from "../LoadingUx";

interface Props {
  crypto: Crypto;
  handleClose: () => void;
  walletQuantity: number;
}

export const SellCryptoForm: React.FC<Props> = ({
  crypto,
  handleClose,
  walletQuantity,
}) => {
  const { setUser } = useGlobalContext();
  const [checked, setChecked] = React.useState<boolean>(false);
  const [quantity, setQuantity] = React.useState<number>(0);
  const [error, setError] = React.useState<Error>({ exists: false });
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSell = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    if (quantity === 0 || Number.isNaN(quantity)) {
      setError({ exists: true, message: "Please enter a valid quantity" });
    } else {
      try {
        const user: User = await sellCrypto(crypto.name, quantity);
        setUser(user);
        setLoading(false);
        handleClose();
      } catch (error) {
        setLoading(false);
        setError({ exists: true, message: error.response.data.message });
      }
    }
  };

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  React.useEffect(() => {
    if (checked) {
      setQuantity(walletQuantity);
    } else {
      setQuantity(0);
    }
  }, [checked, walletQuantity]);

  return (
    <form onSubmit={handleSell} className="SellCryptoForm">
      <Typography
        id="modal-modal-title"
        variant="h6"
        component="h2"
        sx={{ textAlign: "center" }}
      >
        Sell {capitalizeFirstLetter(crypto.name)}
      </Typography>

      <div className="priceOverview">
        <div className="cryptoDetails">
          <Avatar
            sx={{ border: "solid black 1px" }}
            aria-label="crypto"
            src={crypto.image}
          />
          <div className="buyPrice">
            <p className="buyPrice">Current Price</p>
            <p>${formatPrice(crypto.price)}</p>
          </div>
        </div>

        <div className="balanceDetails">
          <Avatar
            sx={{ border: "solid black 1px", backgroundColor: "black" }}
            aria-label="balance"
          >
            <AccountBalanceWalletIcon />
          </Avatar>
          <div className="balance">
            <p className="balance">Coin(s)</p>
            <p>{walletQuantity}</p>
          </div>
        </div>
      </div>
      <div className="checkoutDetails">
        <div className="quantitySelectors">
          <TextField
            className="quantityInput"
            id="outlined-number"
            label="Enter Quantity"
            type="number"
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              inputProps: { min: 0, max: walletQuantity },
            }}
            value={quantity}
            onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
          />
          <FormControlLabel
            className="checkBox"
            control={<Checkbox onChange={handleChecked} value={checked} />}
            label="sell max"
          />
        </div>

        <p className="totalCalculation">
          Total: ${formatPrice(quantity * crypto.price)}
        </p>
      </div>
      <Button type="submit" className="purchaseBtn" variant="contained">
        Confirm Sell Order
      </Button>
      {/* Error Reporting UI */}
      {error.exists ? (
        <Alert severity="error" sx={{ marginTop: "10px", padding: "0 5px" }}>
          {error.message}
        </Alert>
      ) : null}
      {loading ? <LoadingUx /> : null}
    </form>
  );
};