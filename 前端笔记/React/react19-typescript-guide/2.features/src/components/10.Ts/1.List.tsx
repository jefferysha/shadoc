interface ListProps<T> {
  data: T[];
  onChange: (item: T) => void;
}

export function List<T>(props: ListProps<T>) {
  return (
    <div>
      {props.data.map((item) => (
        <div key={item}>
          {item}
          <button onClick={() => props.onChange(item)}>点击</button>
        </div>
      ))}
    </div>
  );
}

export const ListDemo = () => {
  return (
    <List data={[{ name: "heyi" }]} onChange={(item) => console.log(item)} />
  );
};
