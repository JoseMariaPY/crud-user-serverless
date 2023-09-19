import os
import boto3
import json

client = boto3.resource('dynamodb')

IS_OFFLINE = os.getenv('IS_OFFLINE', False)
if IS_OFFLINE:
    boto3.Session(
        aws_access_key_id=os.getenv('ACCESS_KEY'),
        aws_secret_access_key=os.getenv('SECRET_KEY'),
        region_name= os.getenv('REGION')
    )
    client = boto3.resource('dynamodb', endpoint_url=os.getenv('ENDPOINT'))



def scan_dynamodb_table(table_name, page, page_size):
    # Parámetros de paginación
    start = (page - 1) * page_size
    end = start + page_size
    print("Haciendo scan")
    try:
        response = table_name.scan()
        items = response['Items'][start:end]
        return items
    except Exception:
        print(f"Error al escanear la tabla DynamoDB")
        return []

def get_users(event, context):
    # Crear una instancia del cliente DynamoDB
    print("Busqueda de usuarios")
    query_params = event.get('queryStringParameters') if event.get('queryStringParameters') is not None else {}
    print("query_params", query_params)
    page = int(query_params.get('page', 1))
    page_size = int(query_params.get('page_size', 10))
    
    # Obtener la tabla de DynamoDB
    table = client.Table(os.getenv('DB_TABLE'))

    users = scan_dynamodb_table(
        table,
        page, 
        page_size
    )
    #
    result = {
        'statusCode': 200,
        'body': json.dumps({
            'users': [],
            'page': 0,
            'page_size': 0,
            'total': 0
        })
    }
    if len(users) > 0:
        result = {
            'statusCode': 200,
            'body': json.dumps({
                'users': users,
                'page': page,
                'page_size': page_size,
                'total': len(users)
            })
        }
    #
    return result
    
    
    