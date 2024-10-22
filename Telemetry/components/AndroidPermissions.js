import FontAwesome from "@expo/vector-icons/FontAwesome5"

export default function AndroidPermissions({status}) {
  if (status){
    return (
      <FontAwesome name="check" size={18} color="white" />
    )
  }else{
    return (
      <FontAwesome name="ban" size={18} color="white" />
    )
  }
}
