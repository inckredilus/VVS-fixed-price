import json
from pathlib import Path

import pandas as pd


def load_config() -> dict:
    """Load application configuration."""

    config_file = Path("config/settings.json")

    with open(config_file, "r", encoding="utf-8") as f:
        return json.load(f)


def build_service_catalog(df: pd.DataFrame) -> dict:
    """
    Build the services dictionary.
    """

    services = {}

    for _, row in df.iterrows():

        service_id = str(int(row["ServiceID"]))

        services[service_id] = {
            "serviceId": int(row["ServiceID"]),
            "category": row["ServiceCategory"],
            "serviceName": row["ServiceName"],
            "equipment": row["ServiceEquipment"],
            "work": row["ServiceWork"],

            "pricing": {
                "fullPrice": float(row["NormalPrice"]),
                "discountPrice": float(row["DiscountPrice"])
            }
        }

    return services


def build_navigation_tree(df: pd.DataFrame) -> dict:
    """
    Build hierarchy tree used for navigation.
    """

    tree = {}

    for _, row in df.iterrows():

        category = row["ServiceCategory"]
        service_name = row["ServiceName"]
        equipment = row["ServiceEquipment"]
        work = row["ServiceWork"]

        service_id = str(int(row["ServiceID"]))

        tree.setdefault(category, {})
        tree[category].setdefault(service_name, {})
        tree[category][service_name].setdefault(equipment, {})

        tree[category][service_name][equipment][work] = service_id

    return tree


def export_json(output_file: Path,
                navigation: dict,
                services: dict) -> None:

    data = {
        "navigation": navigation,
        "services": services
    }

    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(
            data,
            f,
            ensure_ascii=False,
            indent=4
        )


def main():

    config = load_config()

    excel_file = Path(config["excelFile"])
    output_file = Path(config["outputJson"])

    print(f"Reading: {excel_file}")

    df = pd.read_excel(
        excel_file,
        sheet_name="Services",
        header=1
    )

    print("Columns found:")
    for col in df.columns:
        print(f"- {col}")

    print(f"Loaded {len(df)} service rows")

    navigation = build_navigation_tree(df)
    services = build_service_catalog(df)

    export_json(
        output_file,
        navigation,
        services
    )

    print(f"Generated: {output_file}")


if __name__ == "__main__":
    main()