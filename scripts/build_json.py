import json
from pathlib import Path

import re
import unicodedata

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
    Order:
    Category → ServiceName → ServiceWork → ServiceEquipment
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
        tree[category][service_name].setdefault(work, {})

        tree[category][service_name][work][equipment] = service_id

    return tree

def build_navigation_descriptions(df: pd.DataFrame) -> dict:
    """
    Build optional markdown paths for navigation levels.

    These files do not have to exist.
    React will try to load them and silently ignore missing files.
    """

    descriptions = {}

    for _, row in df.iterrows():

        category = row["ServiceCategory"]
        service_name = row["ServiceName"]
        work = row["ServiceWork"]

        levels = [
            category,
            service_name,
            work,
        ]

        for index in range(len(levels)):
            label_path = levels[: index + 1]
            json_key = "|".join(label_path)

            slug_path = "/".join(
                slugify(label) for label in label_path
            )

            descriptions[json_key] = (
                f"/descriptions/navigation/{slug_path}.md"
            )

    return descriptions

def export_json(output_file: Path,
                navigation: dict,
                services: dict,
                navigation_descriptions: dict) -> None:

    data = {
        "navigation": navigation,
        "services": services,
        "navigationDescriptions": navigation_descriptions
    }

    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(
            data,
            f,
            ensure_ascii=False,
            indent=4
        )

def slugify(value: str) -> str:
    """Convert Swedish display text into a safe file/folder slug."""

    value = str(value).strip().lower()

    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("ascii")

    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = value.strip("-")

    return value

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
    navigation_descriptions = build_navigation_descriptions(df)

    export_json(
        output_file,
        navigation,
        services,
        navigation_descriptions
    )

    print(f"Generated: {output_file}")


if __name__ == "__main__":
    main()