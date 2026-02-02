export default function Test() {
    const data = [ "Pikachu", "Carapute", "Ta mère"];
    return  <ul>{data.map(function(value) {
        return <li key={value}>{value}</li>;
    })}
    </ul>;
}