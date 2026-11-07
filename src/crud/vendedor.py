def listar() -> list[Vendedor]:
    session = get_session()
    try:
        return session.query(Vendedor).all()
    finally:
        session.close()
