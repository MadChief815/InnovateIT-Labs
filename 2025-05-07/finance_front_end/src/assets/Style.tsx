import { StyleSheet } from "react-native";
import { theme } from "../utils/theme";

const styles = StyleSheet.create({
  // Common styles
  // START
  sideButton: {
    alignItems: "flex-end",
    marginTop: 10,
    marginRight: 16,
    paddingBottom: 15,
  },
  noDataFoundContainer: {
    alignItems: "center",
    marginTop: 20,
    padding: 10,
  },
  noDataText: {
    fontSize: 16,
    color: "gray",
  },
  scrollContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  entityDetailsContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    marginBottom: 20,
  },
  
  rowData: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  columnData: {
   width: "48%",
   marginVertical:8,
  },



  infoText:{
    padding:1,
    fontWeight:'600',
    fontSize:16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  textInput: {
    marginBottom: 25,
  },
  mb1: {
    marginBottom: 5,
  },
  mb2: {
    marginBottom: 10,
  },
  mb3: {
    marginBottom: 15,
  },
  mb4: {
    marginBottom: 20,
  },
  mb5: {
    marginBottom: 25,
  },
  mb6: {
    marginTop:30,
  }
,
  p1: {
    padding: 5,
  },
  p2: {
    padding: 10,
  },
  p3: {
    padding: 15,
  },
  p4: {
    padding: 20,
  },
  p5: {
    padding: 25,
  },
  // END
  heading:{
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },

  header: {
    backgroundColor: "#f0f0f0", // Example for View
    padding: 10,
  },

  center: {
    
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  flex: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },

  label: {
    marginVertical: 5,
  },

  after: {
    color: "red",
    fontSize: 16,
    marginLeft: 2,
  },

  input: {
    height: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#7bf1a8",
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  textArea: {
    height: 100,
    borderWidth: 2,
    borderColor: "#7bf1a8",
    padding: 10,
    textAlignVertical: "top",
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  button: {
    backgroundColor: "#7bf1a8",
    padding: 17,
    width: "35%",
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 20,
  },

  cancelButton: {
    backgroundColor: "#cccc",
    padding: 17,
    width: "35%",
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 20,
  },

  buttonText: {
    textAlign: "center",
  },

  error: {
    color: "red",
    marginTop: 0,
  },

  container: {
    flexDirection: "row",
  },

  link: {
    textAlign: "right",
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 16,
    padding: 5,
    cursor: "pointer",
  },
});

export default styles;
