import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface CardProps {
  customerName?: string;
  customerMobile?: string;
  loanId?: number;
  loanAmount?: string;
  pendingLoan?: boolean;
  repaymentAmount?: string;
  repaymentType?: string;
  loanType?: string;
  loanStatus?: string;
  paymentDate?: string;
  comments?: string;
  onPress?: () => void;
  showPendingLoan?: boolean;
  lineName?: string;
  date?: string;
  expense_amount?:string;
  description?:string;
  children?: React.ReactNode;
  // New prop to control pending loan display
}

const Card: React.FC<CardProps> = ({
  customerName,
  customerMobile,
  loanId,
  loanAmount,
  pendingLoan,
  repaymentAmount,
  repaymentType,
  loanType,
  paymentDate,
  comments,
  lineName,
  loanStatus,
  date,
  expense_amount,
  description,
  children,

  onPress,
  showPendingLoan = false, // Default to false
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
       {/* {pendingLoan && <View style={styles.redDot} />} */}
       {pendingLoan && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Overdue</Text>
        </View>
      )}
       {loanStatus && (
        <View style={[styles.badge, {
          backgroundColor:
            loanStatus === "Overdue"
              ? "red"
              : loanStatus === "Active"
              ? "green"
              : loanStatus === "Inactive"
              ? "grey"
              : "transparent", // Default background
        }]}>
          <Text style={styles.badgeText}>{loanStatus}</Text>
        </View>
      )}
      {customerName && <Text style={styles.customerName}>{customerName}</Text>}
      {lineName && <Text style={styles.customerName}>{lineName}</Text>}
      {customerMobile && (
        <Text style={styles.customerMobile}>Mobile: {customerMobile}</Text>
      )}
      {loanId !== undefined && (
        <Text style={styles.loanDetails}>Loan ID: {loanId}</Text>
      )}
      {loanAmount && (
        <Text style={styles.loanDetails}>Loan Amount Issued: ₹{loanAmount}</Text>
      )}
      {loanType && (
        <Text style={styles.repaymentDetails}>
          Loan Type: {loanType}
        </Text>
      )}

      {/* Show Pending Loan based on the showPendingLoan prop */}
      {(showPendingLoan || pendingLoan) && (
        <Text style={styles.pendingLoan}>
          Pending Loan: {pendingLoan ? "Yes" : "No"}
        </Text>
      )}

      {repaymentAmount && (
        <Text style={styles.repaymentDetails}>
          Repayment Amount: ₹{repaymentAmount}
        </Text>
      )}
      {repaymentType && (
        <Text style={styles.repaymentDetails}>
          Repayment Type: {repaymentType}
        </Text>
      )}
      

      {paymentDate && (
        <Text style={styles.repaymentDetails}>Payment Date: {paymentDate}</Text>
      )}
      {comments && (
        <Text style={styles.repaymentDetails}>Comments: {comments}</Text>
      )}
      {expense_amount && (
        <Text style={styles.repaymentDetails}>Expense Amount: {expense_amount}</Text>
      )}
      {date && (
        <Text style={styles.repaymentDetails}>Date: {date}</Text>
      )}
      {description && (
        <Text style={styles.repaymentDetails}>Description: {description}</Text>
      )}
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ADD8E6",
    borderRadius: 8,
    backgroundColor: "#fff",
    position:"relative"
  },
  redDot: {
    width: 12,
    height: 12,
    backgroundColor: "red",
    borderRadius: 6, // Makes it a circle
    position: "absolute",
    top: 8,
    right: 8,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  customerMobile: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  loanDetails: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  pendingLoan: {
    fontSize: 16,
    color: "green",
  },
  repaymentDetails: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  badge: {
    position: "absolute", // Positions the badge relative to the card
    top: 8, // Distance from the top
    right: 8, // Distance from the right
    backgroundColor: "green", // Badge color
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Card;
